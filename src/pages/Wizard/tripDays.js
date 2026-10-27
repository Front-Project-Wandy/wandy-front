// 가는 날~오는 날을 DAY 목록으로 바꾼다: [{ dayIndex: 0, date: '2026-11-06' }, ...].
// new Date('2026-11-06')은 UTC 자정이라 한국에서 하루 어긋날 수 있어서, 숫자로 나눠 로컬 날짜로 만든다.
const toDateString = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

export function getTripDays(startDate, endDate) {
  if (!startDate || !endDate || endDate < startDate) return [];

  const [sy, sm, sd] = startDate.split('-').map(Number);
  const current = new Date(sy, sm - 1, sd);
  const days = [];
  while (toDateString(current) <= endDate) {
    days.push({ dayIndex: days.length, date: toDateString(current) });
    current.setDate(current.getDate() + 1);
  }
  return days;
}

// DAY 색은 day-1 ~ day-5 다섯 가지라, 여섯째 날부터는 처음 색부터 다시 쓴다.
// Tailwind가 클래스 이름을 찾을 수 있게 조합하지 않고 그대로 적어 둔다.
const DAY_DOT_CLASSES = ['bg-day-1', 'bg-day-2', 'bg-day-3', 'bg-day-4', 'bg-day-5'];

export const getDayDotClass = (dayIndex) => DAY_DOT_CLASSES[dayIndex % DAY_DOT_CLASSES.length];
