// 지도에 보이는 범위 { south, west, north, east } 안에 있는 장소인지 (74 지도 범위 검색).
// 날짜변경선을 넘는 범위는 west가 east보다 크게 온다 (한·일은 해당 없지만 구글이 이렇게 줄 수 있다).
export function isInBounds({ lat, lng }, { south, west, north, east }) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  if (lat < south || lat > north) return false;
  return west <= east ? lng >= west && lng <= east : lng >= west || lng <= east;
}

// 1단계는 결과가 좌표 있는 더미라 화면에서 거른다. 2단계에서는 이 범위를 검색 조건으로 서버에 보낸다.
export const filterByBounds = (places, bounds) =>
  places.filter((place) => isInBounds(place, bounds));
