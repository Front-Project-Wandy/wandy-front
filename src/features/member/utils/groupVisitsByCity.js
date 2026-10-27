import { listPastTripPlaces } from './listPastTripPlaces';

// 다녀온 곳 지도(96)의 도시별 묶음. 지도(MapView)는 도시 하나 기준이라 끝난 여행을 도시마다 모은다.
// [{ key, country, city, trips: [{ trip, items }], placeCount }]를 최근에 다녀온 도시부터 돌려준다.
// 장소 중복은 listPastTripPlaces가 이미 걸러서(가장 최근 여행에만 남김) placeCount는 곧 서로 다른 장소 수다.
// 도시를 정하지 않은 여행은 지도에 놓을 곳이 없어서 뺀다.
export function groupVisitsByCity(trips, today) {
  const groups = new Map();
  listPastTripPlaces(trips, today).forEach((group) => {
    const { country, city } = group.trip;
    if (!country || !city) return;
    const key = `${country}:${city}`;
    if (!groups.has(key)) groups.set(key, { key, country, city, trips: [], placeCount: 0 });
    const cityGroup = groups.get(key);
    cityGroup.trips.push(group);
    cityGroup.placeCount += group.items.length;
  });
  return [...groups.values()];
}

// MapView의 days 모양으로 바꾼다. 여행 하나를 DAY 하나로 넘겨서 여행마다 마커 색이 달라진다
// (n번째 여행 = DAY n 색, 범례도 같은 순서로 그린다).
export const toVisitDays = (cityTrips) =>
  cityTrips.map(({ trip, items }) => ({ date: trip.startDate, items }));
