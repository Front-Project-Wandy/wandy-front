// 개발 서버(npm run dev) 전용 Gemini 중계 — 대화형 여행 비서(요구사항 101).
// 백엔드(2단계)가 생기기 전까지 Gemini 키를 브라우저에 보내지 않으려고 Vite 개발 서버가 대신 부른다.
// 키는 .env.local의 GEMINI_API_KEY(VITE_ 없음)라 클라이언트 번들에 들어가지 않는다.
// 빌드한 배포판에는 이 중계가 없어서, 화면(aiService)은 가짜 비서로 대신 답한다.
// 2단계에서 Spring Boot API가 같은 일을 맡으면 이 파일과 vite.config.js의 플러그인을 지운다.
//
// 요청: POST /api/ai/chat { systemInstruction: string, contents: [{ role: 'user'|'model', parts: [{ text }] }],
//        responseSchema: JSON Schema }
// 응답: 성공 { data: { text } } / 실패 HTTP 상태 + { error: { code, message } } (팀 API 응답 규칙과 같다)

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const MAX_BODY_BYTES = 64 * 1024;
const MAX_CONTENTS = 24;
const TIMEOUT_MS = 30 * 1000;

const send = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
};

const fail = (res, status, code, message = code) => send(res, status, { error: { code, message } });

// 너무 큰 요청은 끊는다 — 개발용이라도 아무 글이나 Gemini로 흘려보내지 않게.
const readJsonBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('BODY_TOO_LARGE'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });

const isValidContents = (contents) =>
  Array.isArray(contents) &&
  contents.length > 0 &&
  contents.length <= MAX_CONTENTS &&
  contents.every(
    (content) =>
      (content?.role === 'user' || content?.role === 'model') &&
      Array.isArray(content.parts) &&
      content.parts.every((part) => typeof part?.text === 'string'),
  );

export function createGeminiProxy({ apiKey, model }) {
  return async (req, res) => {
    if (req.method !== 'POST') return fail(res, 405, 'METHOD_NOT_ALLOWED');
    // 키가 없으면 화면이 가짜 비서로 넘어가도록 503으로 알린다
    if (!apiKey) return fail(res, 503, 'NO_API_KEY', 'GEMINI_API_KEY가 .env.local에 없어요');

    let body;
    try {
      body = await readJsonBody(req);
    } catch {
      return fail(res, 400, 'BAD_REQUEST');
    }
    const { systemInstruction, contents, responseSchema } = body ?? {};
    if (typeof systemInstruction !== 'string' || !isValidContents(contents)) {
      return fail(res, 400, 'BAD_REQUEST');
    }

    try {
      const response = await fetch(`${GEMINI_URL}/${model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: {
            responseMimeType: 'application/json',
            ...(responseSchema ? { responseJsonSchema: responseSchema } : {}),
          },
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        return fail(res, 502, 'GEMINI_ERROR', data?.error?.message ?? `HTTP ${response.status}`);
      }
      // 생각(thought) 부분을 빼고 답 글자만 이어 붙인다
      const text = (data?.candidates?.[0]?.content?.parts ?? [])
        .filter((part) => typeof part.text === 'string' && !part.thought)
        .map((part) => part.text)
        .join('');
      return send(res, 200, { data: { text } });
    } catch (error) {
      return fail(res, 502, 'GEMINI_UNREACHABLE', error.message);
    }
  };
}
