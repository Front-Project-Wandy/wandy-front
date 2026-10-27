import { getLocalDateString, getTripStatus } from '../../features/member/utils/tripDates';

// 홈 D-day 카드(91)에 보여 줄 여행 하나를 고른다. 여러 여행 보관함(#59) 때문에 지금 열린 여행(trip)이
// 지난 여행일 수도 있어서, 전체 목록에서 다시 고른다.
// 여행 중인 여행이 먼저이고, 없으면 출발이 가장 가까운 예정 여행. 둘 다 없으면 null.
// 날짜는 'YYYY-MM-DD' 문자열이라 글자 비교로 앞뒤를 정한다.
export function pickUpcomingTrip(trips, today = getLocalDateString()) {
  const withStatus = trips.map((trip) => ({ trip, status: getTripStatus(trip, today) }));
  const ongoing = withStatus.find((entry) => entry.status === 'ongoing');
  if (ongoing) return { trip: ongoing.trip, status: 'ongoing' };

  const nearest = withStatus
    .filter((entry) => entry.status === 'upcoming')
    .reduce(
      (best, entry) => (!best || entry.trip.startDate < best.trip.startDate ? entry : best),
      null,
    );
  return nearest ? { trip: nearest.trip, status: 'upcoming' } : null;
}
