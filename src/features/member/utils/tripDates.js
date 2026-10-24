// 내 여행 목록(36)의 날짜 계산. 여행 날짜는 'YYYY-MM-DD' 문자열이다.
// toISOString()은 UTC라 한국 시간 새벽에는 하루 전 날짜가 나와서 로컬 날짜로 만든다.
export function getLocalDateString(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 같은 형식의 날짜 문자열은 글자 순서가 곧 날짜 순서라 그대로 비교한다.
// 날짜를 아직 안 정한 여행은 null.
export function getTripStatus(trip, today = getLocalDateString()) {
  if (!trip?.startDate || !trip?.endDate) return null;
  if (today < trip.startDate) return 'upcoming';
  if (today > trip.endDate) return 'past';
  return 'ongoing';
}

const toUtcDay = (dateString) => {
  const [y, m, d] = dateString.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
};

// 출발까지 남은 날 (D-n). 서머타임이 있어도 하루 길이가 어긋나지 않게 UTC 자정끼리 뺀다.
export function getDaysUntil(startDate, today = getLocalDateString()) {
  return Math.round((toUtcDay(startDate) - toUtcDay(today)) / (24 * 60 * 60 * 1000));
}

// '11월 10일' 같은 짧은 날짜. 문자열을 숫자로 나눠 로컬 날짜로 만든다 (new Date('2026-11-10')은 UTC 자정).
export function formatShortDate(dateString, locale = 'ko') {
  const [y, m, d] = dateString.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(locale, { month: 'long', day: 'numeric' });
}
