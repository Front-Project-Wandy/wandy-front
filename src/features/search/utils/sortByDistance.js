import { getDistanceMeters } from './geo';

// 기준 좌표(숙소, 없으면 그날 직전 장소)가 숫자로 있어야 가까운 순을 보여줄 수 있다.
export const isValidOrigin = (origin) =>
  Number.isFinite(origin?.lat) && Number.isFinite(origin?.lng);

// 가까운 순 정렬 (43). 카드에 거리를 같이 보여주려고 { place, distance }로 돌려준다.
// 원본 배열은 Query 캐시라 바꾸지 않고, 거리가 같으면 원래 순서를 지킨다(sort는 안정 정렬).
export function sortByDistance(places, origin) {
  return places
    .map((place) => ({ place, distance: getDistanceMeters(origin, place) }))
    .sort((a, b) => a.distance - b.distance);
}
