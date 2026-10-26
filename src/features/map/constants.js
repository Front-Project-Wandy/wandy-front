// 나라별 지도 제공자 (CLAUDE.md: 한국 = 네이버 지도, 일본 = 구글 지도)
export const MAP_PROVIDERS = { KR: 'naver', JP: 'google' };

// 1단계에서 장소 더미가 있는 도시의 지도 중심 좌표 (search/place.js의 CITIES_BY_COUNTRY와 같은 도시)
export const CITY_CENTERS = {
  seoul: { lat: 37.5665, lng: 126.978 },
  tokyo: { lat: 35.6762, lng: 139.6503 },
};

export const DEFAULT_ZOOM = 12;

// DAY별 색은 5개(CLAUDE.md 디자인 기준)만 정해져 있어서, 6일째부터는 처음 색으로 돌아간다.
export const DAY_COLOR_COUNT = 5;

// 번호 마커의 테두리 색. Tailwind는 클래스 이름이 코드에 통째로 있어야 만들어 주기 때문에 목록으로 둔다.
export const DAY_BORDER_CLASSES = [
  'border-day-1',
  'border-day-2',
  'border-day-3',
  'border-day-4',
  'border-day-5',
];

// 마커 크기는 Tailwind size-8(32px)과 맞춘다. 네이버 마커는 이 크기의 절반이 중심점이다.
export const MARKER_SIZE = 32;
// 구글 기본 마커 원은 반지름 기준이라 지름 32px에서 테두리 두께를 뺀 값의 절반이다.
export const GOOGLE_MARKER_SCALE = 14;
export const MARKER_RING_WEIGHT = 4;
export const MARKER_FONT_SIZE = '14px';
export const ROUTE_STROKE_WEIGHT = 4;
export const ROUTE_STROKE_OPACITY = 0.9;

// 장소가 하나뿐이면 영역을 맞출 수 없어서 그 자리를 이 확대 수준으로 보여 준다
export const SINGLE_POINT_ZOOM = 15;
export const FIT_PADDING = 48;

// 목록에서 장소를 고르면 지도가 이 확대 수준 이상으로 그 장소를 보여 준다 (15)
export const SELECTED_MIN_ZOOM = 14;
export const GOOGLE_MARKER_SCALE_SELECTED = 18;
export const SELECTED_Z_INDEX = 100;
