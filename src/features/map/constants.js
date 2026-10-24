// 나라별 지도 제공자 (CLAUDE.md: 한국 = 네이버 지도, 일본 = 구글 지도)
export const MAP_PROVIDERS = { KR: 'naver', JP: 'google' };

// 1단계에서 장소 더미가 있는 도시의 지도 중심 좌표 (search/place.js의 CITIES_BY_COUNTRY와 같은 도시)
export const CITY_CENTERS = {
  seoul: { lat: 37.5665, lng: 126.978 },
  tokyo: { lat: 35.6762, lng: 139.6503 },
};

export const DEFAULT_ZOOM = 12;
