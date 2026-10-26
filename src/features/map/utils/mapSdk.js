import { loadScript } from './loadScript';

// 구글 SDK는 스크립트가 불러와진 뒤에도 google.maps.importLibrary를 곧바로 만들어 주지 않는다.
// onload만 믿으면 새로고침 때 가끔 "importLibrary is not a function"이 나서, 구글이 준비됐을 때
// 불러 주는 callback을 기다린다. 다시 시도할 때 같은 요청을 두 번 보내지 않도록 Promise를 기억한다.
const GOOGLE_READY_CALLBACK = '__wandyGoogleMapsReady';
let googleReady = null;

const loadGoogleMaps = (key) => {
  if (!googleReady) {
    googleReady = new Promise((resolve, reject) => {
      window[GOOGLE_READY_CALLBACK] = resolve;
      loadScript(
        // loading=async로 불러오면 라이브러리를 따로 받아야 google.maps.Map을 쓸 수 있다
        `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&loading=async&callback=${GOOGLE_READY_CALLBACK}`,
      ).catch(reject);
    })
      .then(() => window.google.maps.importLibrary('maps'))
      // 실패한 기록을 남기면 다시 시도해도 같은 실패만 돌려주므로 지운다
      .catch((error) => {
        googleReady = null;
        throw error;
      });
  }
  return googleReady;
};

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
    load: loadGoogleMaps,
  },
};

export const getMapKey = (provider) => SDK[provider]?.getKey();

export const loadMapSdk = (provider) => SDK[provider].load(getMapKey(provider));
