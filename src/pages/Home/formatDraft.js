// 'YYYY-MM-DD' 두 개를 와이어프레임 표기 '11.06–11.08'로 바꾼다.
export function formatDateRange(startDate, endDate) {
  const toShort = (date) => date.slice(5).replace('-', '.');
  return `${toShort(startDate)}–${toShort(endDate)}`;
}

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

// 저장 시각을 "10분 전", "어제"처럼 바꾼다. 언어별 표현은 브라우저 내장 Intl이 맡는다.
export function formatSavedAgo(savedAt, language, now = Date.now()) {
  const formatter = new Intl.RelativeTimeFormat(language, { numeric: 'auto' });
  const diff = savedAt - now;

  // 1분 안쪽을 'minute' 0으로 쓰면 한국어가 "현재 분"이 돼서 'second' 0("지금")으로 쓴다.
  if (Math.abs(diff) < MINUTE_MS) return formatter.format(0, 'second');
  if (Math.abs(diff) < HOUR_MS) return formatter.format(Math.round(diff / MINUTE_MS), 'minute');
  if (Math.abs(diff) < DAY_MS) return formatter.format(Math.round(diff / HOUR_MS), 'hour');
  return formatter.format(Math.round(diff / DAY_MS), 'day');
}
