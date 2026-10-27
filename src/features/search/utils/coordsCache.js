// 구글 장소 좌표 캐시 30일 (약관, 요구사항 5).
// Places API의 위도·경도는 최대 30일 연속까지만 임시로 저장할 수 있고, 그 뒤에는 지워야 한다.
// place_id는 기한 없이 저장해도 된다. 네이버·TourAPI 장소에는 이 제한이 없다.
// https://cloud.google.com/maps-platform/terms/maps-service-terms (Places API 캐시 조항)
export const COORDS_CACHE_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

const hasCoords = (item) => Number.isFinite(item.lat) && Number.isFinite(item.lng);

// 플랜 item(구글)의 좌표가 30일이 됐는지. 저장 시각이 없거나 깨졌으면 만료로 본다.
// 하루 넘기기 전에 다시 받도록 30일째부터 만료로 본다.
export function isCoordsExpired(item, now = Date.now()) {
  if (item?.source !== 'google' || !hasCoords(item)) return false;
  const cachedAt = Date.parse(item.coordsCachedAt);
  if (!Number.isFinite(cachedAt)) return true;
  return now - cachedAt >= COORDS_CACHE_DAYS * DAY_MS;
}

// 좌표를 다시 받아야 하는 구글 item: 30일이 됐거나, 만료·조회 실패로 좌표를 지운 것
export const needsCoordsRefresh = (item, now = Date.now()) =>
  item?.source === 'google' && (!hasCoords(item) || isCoordsExpired(item, now));

// 여행에서 좌표를 다시 받아야 하는 item 목록 [{ dayIndex, item }]
export const findCoordsToRefresh = (trip, now = Date.now()) =>
  (trip?.days ?? []).flatMap((day, dayIndex) =>
    day.items.filter((item) => needsCoordsRefresh(item, now)).map((item) => ({ dayIndex, item })),
  );

// 만료된 좌표를 지운 여행을 돌려준다 (보관함 여행처럼 지금 다시 받지 않는 경우).
// 지운 좌표는 그 여행을 다시 열 때 useRefreshExpiredCoords가 받아 온다. 바뀐 게 없으면 같은 객체를 돌려준다.
export function stripExpiredCoords(trip, now = Date.now()) {
  const hasExpired = (trip?.days ?? []).some((day) =>
    day.items.some((item) => isCoordsExpired(item, now)),
  );
  if (!hasExpired) return trip;
  return {
    ...trip,
    days: trip.days.map((day) => ({
      ...day,
      items: day.items.map((item) =>
        isCoordsExpired(item, now) ? { ...item, lat: null, lng: null } : item,
      ),
    })),
  };
}
