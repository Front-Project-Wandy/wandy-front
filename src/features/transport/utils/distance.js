const EARTH_RADIUS_METERS = 6371000;

const toRadians = (degree) => (degree * Math.PI) / 180;

// 두 좌표 사이의 직선거리(m). 하버사인 공식이라 지구가 둥근 것까지 반영한다.
export const getDistanceMeters = (from, to) => {
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(a));
};
