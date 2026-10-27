import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // index.html의 %VITE_SITE_URL%(공유 미리보기 주소, 98). 배포 전처럼 값이 없을 때 글자가 그대로 남고
  // 빌드마다 경고가 나지 않도록 빈 값으로 둔다 → 이미지 주소가 /og-image.png(상대 주소)가 된다.
  // Vite는 .env 파일보다 실제 환경 변수를 우선해서, 빈 값을 먼저 채우면 .env.local의 값이 무시된다.
  // 그래서 .env 파일 값을 먼저 읽고, 그것도 없을 때만 빈 값을 넣는다.
  process.env.VITE_SITE_URL ??= loadEnv(mode, process.cwd()).VITE_SITE_URL ?? '';

  return {
    plugins: [react(), tailwindcss()],
  };
});
