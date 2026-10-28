import { CITY_CENTERS } from '../constants';

const hasCoords = (point) => Number.isFinite(point?.lat) && Number.isFinite(point?.lng);

// 날씨를 조회할 기준 좌표: 숙소 → 일정의 첫 장소 → 도시 중심 순서로 쓴다 (58).
// 한 도시 안에서는 날씨가 거의 같아서 여행 하나에 한 번만 조회한다.
export function getWeatherPoint(trip) {
  if (!trip) return null;
  if (hasCoords(trip.stay)) return { lat: trip.stay.lat, lng: trip.stay.lng };
  const firstItem = trip.days.flatMap((day) => day.items).find(hasCoords);
  if (firstItem) return { lat: firstItem.lat, lng: firstItem.lng };
  return CITY_CENTERS[trip.city] ?? null;
}
