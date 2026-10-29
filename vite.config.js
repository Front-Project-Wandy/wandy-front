import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { createGeminiProxy } from './vite-plugins/geminiProxy.js';

// 대화형 여행 비서(101)가 쓰는 Gemini 모델. 모델 이름이 자주 바뀌어서 .env.local의 GEMINI_MODEL로 바꿀 수 있게 둔다.
const DEFAULT_GEMINI_MODEL = 'gemini-3.8-flash';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 세 번째 인자 ''는 VITE_가 없는 값까지 읽는다는 뜻이다. 이 값은 설정 파일(Node)에서만 쓰고 브라우저로는 보내지 않는다.
  const serverEnv = loadEnv(mode, process.cwd(), '');
  // index.html의 %VITE_SITE_URL%(공유 미리보기 주소, 98). 배포 전처럼 값이 없을 때 글자가 그대로 남고
  // 빌드마다 경고가 나지 않도록 빈 값으로 둔다 → 이미지 주소가 /og-image.png(상대 주소)가 된다.
  // Vite는 .env 파일보다 실제 환경 변수를 우선해서, 빈 값을 먼저 채우면 .env.local의 값이 무시된다.
  // 그래서 .env 파일 값을 먼저 읽고, 그것도 없을 때만 빈 값을 넣는다.
  process.env.VITE_SITE_URL ??= loadEnv(mode, process.cwd()).VITE_SITE_URL ?? '';

  return {
    plugins: [
      react(),
      tailwindcss(),
      // 개발 서버에서만 /api/ai/chat을 Gemini로 중계한다 (vite-plugins/geminiProxy.js). 빌드 결과에는 들어가지 않는다.
      {
        name: 'wandy-gemini-proxy',
        apply: 'serve',
        configureServer(server) {
          server.middlewares.use(
            '/api/ai/chat',
            createGeminiProxy({
              apiKey: serverEnv.GEMINI_API_KEY,
              model: serverEnv.GEMINI_MODEL || DEFAULT_GEMINI_MODEL,
            }),
          );
        },
      },
    ],
  };
});
