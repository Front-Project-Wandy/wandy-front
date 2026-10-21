// 거리(m)를 화면용 숫자와 단위로 — 1km 미만은 m, 이상은 소수 한 자리 km.
export function formatDistance(meters) {
  if (meters < 1000) return { unit: 'm', value: Math.round(meters) };
  return { unit: 'km', value: Math.round(meters / 100) / 10 };
}
