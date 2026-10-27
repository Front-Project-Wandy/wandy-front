import { getTripStatus } from './tripDates';

// 다녀온 장소 평가(97)에 보여 줄 목록. 끝난 여행만, 최근에 끝난 여행부터 [{ trip, items }]로 돌려준다.
// 같은 장소를 여러 여행에서 담았으면 가장 최근 여행에만 한 번 보여 준다 (평가는 장소마다 하나라서).
// items는 플랜 item 그대로라 구글 장소는 name이 null이다 (화면에서 placeId로 다시 불러온다).
export function listPastTripPlaces(trips, today) {
  const seen = new Set();
  return trips
    .filter((trip) => getTripStatus(trip, today) === 'past')
    .sort((a, b) => b.endDate.localeCompare(a.endDate))
    .map((trip) => ({
      trip,
      items: (trip.days ?? [])
        .flatMap((day) => day.items)
        .filter((item) => {
          if (seen.has(item.placeId)) return false;
          seen.add(item.placeId);
          return true;
        }),
    }))
    .filter(({ items }) => items.length > 0);
}
