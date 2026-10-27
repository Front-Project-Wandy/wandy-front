import { getTripStatus } from './tripDates';

// 날짜는 'YYYY-MM-DD', 수정 시각은 ISO 문자열이라 글자 순서가 곧 시간 순서다.
const byLatestUpdate = (a, b) => (b.trip.updatedAt ?? '').localeCompare(a.trip.updatedAt ?? '');

// 예정: 진행 중 → 가까운 출발일 순. 날짜를 안 정한 여행은 맨 뒤에 최근 수정 순으로 둔다.
const byUpcoming = (a, b) => {
  if (a.status && b.status) return a.trip.startDate.localeCompare(b.trip.startDate);
  if (a.status || b.status) return a.status ? -1 : 1;
  return byLatestUpdate(a, b);
};

// 지난 여행: 최근에 끝난 여행부터
const byRecentlyEnded = (a, b) => b.trip.endDate.localeCompare(a.trip.endDate);

// 내 여행 목록(36)을 예정(진행 중·날짜 미정 포함)과 지난 여행으로 나눠 [{ trip, status }]로 돌려준다.
export function groupMyTrips(trips, today) {
  const items = trips.map((trip) => ({ trip, status: getTripStatus(trip, today) }));
  return {
    upcoming: items.filter(({ status }) => status !== 'past').sort(byUpcoming),
    past: items.filter(({ status }) => status === 'past').sort(byRecentlyEnded),
  };
}
