import { addDays, getDateRange } from './planDays';

// 장소 하나를 복사한다. id만 새로 만들고, 교통(transportToNext)은 다음 장소가 달라질 수 있어 비워 둔다(화면에서 다시 계산).
// 구글 장소는 이름을 저장하지 않으므로(name: null) 그대로 복사해도 약관에 맞는다.
const copyItem = (item, createId) => ({ ...item, id: createId(), transportToNext: null });

// 여행을 통째로 복사해 새 날짜(startDate)에 놓는다 (71). 일수는 원본과 같게 유지한다.
// 항공은 날짜가 들어 있는 시각이라 새 날짜와 맞지 않아 비우고, 숙소는 체크인·체크아웃 날짜만 비운다.
// 원본은 건드리지 않고, 날짜가 없는 여행(DAY가 없음)이면 복사할 수 없어 null이다.
export const buildTripCopy = (trip, { title, startDate }, createId) => {
  if (!trip || trip.days.length === 0 || !startDate) return null;

  const endDate = addDays(startDate, trip.days.length - 1);
  const dates = getDateRange(startDate, endDate);

  return {
    ...trip,
    id: createId(),
    title,
    startDate,
    endDate,
    companion: trip.companion ?? null,
    preferredCategories: [...(trip.preferredCategories ?? [])],
    flight: null,
    stay: trip.stay ? { ...trip.stay, checkIn: null, checkOut: null } : null,
    days: dates.map((date, i) => ({
      date,
      items: trip.days[i].items.map((item) => copyItem(item, createId)),
    })),
    updatedAt: new Date().toISOString(),
  };
};
