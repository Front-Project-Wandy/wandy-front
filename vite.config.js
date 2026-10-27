import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// index.html의 %VITE_SITE_URL%(공유 미리보기 주소, 98). 배포 전처럼 값이 없을 때 글자가 그대로 남고
// 빌드마다 경고가 나지 않도록 빈 값으로 둔다 → 이미지 주소가 /og-image.png(상대 주소)가 된다.
process.env.VITE_SITE_URL ??= '';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
