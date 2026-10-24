import { loadScript } from './loadScript';

// 지도 키는 도메인 제한을 건 표시용이라 VITE_ 접두사를 쓴다 (CLAUDE.md 보안 규칙).
const SDK = {
  naver: {
    getKey: () => import.meta.env.VITE_NAVER_MAP_CLIENT_ID,
    load: (key) =>
      loadScript(
        `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(key)}`,
      ),
  },
  google: {
    getKey: () => import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    // loading=async로 불러오면 라이브러리를 따로 받아야 google.maps.Map을 쓸 수 있다
    load: async (key) => {
      await loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&loading=async`,
      );
      await window.google.maps.importLibrary('maps');
    },
  },
};

export const getMapKey = (provider) => SDK[provider]?.getKey();

export const loadMapSdk = (provider) => SDK[provider].load(getMapKey(provider));
