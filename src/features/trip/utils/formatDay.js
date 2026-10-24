// new Date('2026-10-26')은 UTC 자정으로 읽혀 시간대에 따라 하루 어긋날 수 있어서,
// 숫자로 나눠 로컬 날짜로 만든다.
export const formatDayDate = (dateString, locale = 'ko') => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
};
