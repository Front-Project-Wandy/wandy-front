// 대화형 여행 비서(101)가 Gemini에 보내는 요청. 2단계에서는 서버가 같은 지시문과 스키마를 쓴다.
// 답은 { reply, actions } JSON으로만 받는다. actions는 바로 적용하지 않고 화면에서 미리 보여 준 뒤 사용자가 고른다.

// 대화가 길어지면 앞의 말은 빼고 최근 것만 보낸다
export const MAX_HISTORY = 12;

export const ASSISTANT_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    reply: { type: 'string', description: '사용자에게 보여 줄 한국어 답. 3~5문장 이내.' },
    actions: {
      type: 'array',
      description: '일정을 바꾸자고 할 때만 넣는다. 질문에 답만 할 때는 빈 배열.',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['add', 'remove', 'move', 'updateTime'] },
          ref: {
            type: 'string',
            description: "remove·move·updateTime: 일정 장소의 ref (예: '2-3')",
          },
          placeName: { type: 'string', description: 'add: candidatePlaces에 있는 이름 그대로' },
          day: { type: 'integer', description: 'add: 넣을 DAY 번호, move: 옮길 DAY 번호 (1부터)' },
          startTime: { type: 'string', description: "add·updateTime: 'HH:MM' 24시간제" },
          stayMinutes: { type: 'integer', description: 'add·updateTime: 머무는 시간(분)' },
        },
        required: ['type'],
      },
    },
  },
  required: ['reply', 'actions'],
};

// 일정 데이터만 근거로 하면 날씨·옷차림 같은 일반 여행 질문에 「정보가 없다」고만 답해서,
// 널리 알려진 여행지 정보는 답하게 하고 날마다 바뀌는 사실(예보·영업·가격)만 지어내지 않게 한다.
const SYSTEM_INSTRUCTION = `너는 여행 플래너 앱 Wandy의 여행 비서다. 사용자의 지금 여행 일정을 보고 한국어로 친절하고 짧게 답한다.
규칙:
- 일정·후보 장소·예상 비용처럼 아래 "여행" JSON에 있는 내용은 그 정보를 근거로 답한다.
- 여행지 일반 정보(계절 날씨 경향과 옷차림, 짐 챙기기, 교통·결제·팁 문화, 동네 분위기, 음식)는 널리 알려진 내용으로 답해도 된다. 여행 도시와 날짜(startDate~endDate)에 맞춰 구체적으로 말하고, "보통", "대체로"처럼 일반적인 경향이라는 것이 드러나게 쓴다.
- 날마다 바뀌는 정확한 사실(특정 날의 실제 날씨 예보, 오늘 영업 여부, 지금 가격, 운행 시간표)은 지어내지 않는다. 대략적인 경향만 말하고 출발 전에 확인하라고 덧붙인다. 날씨는 플래너의 DAY별 날씨 칸에서 예보를 볼 수 있다고 알려 준다.
- 여행과 관계없는 질문에는 짧게 답하고 여행 이야기로 돌아온다.
- 일정을 바꿔 달라고 하면 actions에 넣고, reply에는 무엇을 바꾸자고 제안하는지 적는다. 바로 바뀐 것처럼 말하지 않는다 ("이렇게 바꿀까요?").
- 장소 추가(add)는 candidatePlaces에 있는 이름만 그대로 쓴다. 없는 곳은 추가하지 말고 reply에서 후보에 없다고 알려 준다.
- 이미 일정에 있는 장소는 ref로만 가리킨다. ref를 지어내지 않는다.
- DAY 번호는 1부터, 시각은 'HH:MM' 24시간제다.
- 질문에 답만 할 때는 actions를 빈 배열로 둔다.
- 금액은 estimatedCost의 통화 그대로 말하고, 추정치라는 것을 함께 말한다.`;

export const buildAssistantRequest = ({ history, context }) => ({
  systemInstruction: `${SYSTEM_INSTRUCTION}\n\n여행:\n${JSON.stringify(context)}`,
  contents: history.slice(-MAX_HISTORY).map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: message.text }],
  })),
  responseSchema: ASSISTANT_RESPONSE_SCHEMA,
});

// Gemini가 준 글자를 { reply, actions }로. JSON이 아니면(스키마를 무시한 경우) 글자 전체를 답으로 쓰고 제안은 없다.
export const parseAssistantText = (text) => {
  const trimmed =
    typeof text === 'string' ? text.trim().replace(/^```(?:json)?\s*|\s*```$/g, '') : '';
  try {
    const parsed = JSON.parse(trimmed);
    return {
      reply: typeof parsed?.reply === 'string' ? parsed.reply : '',
      actions: Array.isArray(parsed?.actions) ? parsed.actions : [],
    };
  } catch {
    return { reply: trimmed, actions: [] };
  }
};
