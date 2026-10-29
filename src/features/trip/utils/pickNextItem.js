import { toMinutes } from './buildTimeline';

// 오늘 일정 모드 (요구사항 #93)에서 쓰는 계산.

// 'YYYY-MM-DD'. toISOString은 UTC 기준이라 한국·일본의 이른 아침에 하루 어긋나서 로컬 날짜로 만든다.
export const toLocalDateString = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

// 오늘이 여행의 몇 번째 DAY인지(0부터). 여행 기간이 아니면 -1이다.
export const getTodayDayIndex = (days, today) => days.findIndex((day) => day.date === today);

// 다녀오지 않은 첫 장소(목록 순서 기준)와, 그 시작까지 남은 분을 돌려준다.
// 시작 시각이 지났으면 minutesUntil이 0 이하이고, 시각 형식이 틀리면 null이다.
export const pickNextItem = ({ items, visitedIds, nowMinutes }) => {
  const nextItem = items.find((item) => !visitedIds.includes(item.id)) ?? null;
  if (!nextItem) return { nextItem: null, minutesUntil: null };
  const startMinutes = toMinutes(nextItem.startTime);
  return {
    nextItem,
    minutesUntil: startMinutes === null ? null : startMinutes - nowMinutes,
  };
};
