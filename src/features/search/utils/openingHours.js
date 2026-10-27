// 영업시간 경고 (74). Place.openingHours는 구글 weekdayDescriptions 그대로라 월요일부터 7줄이다.
// 예: '월요일: 06:00~17:00', '화요일: 24시간 영업', '수요일: 휴무일',
//     '목요일: 11:00~다음 날 09:00', '금요일: 11:00~14:00, 17:00~22:00'
// 모르는 형식이면 경고하지 않는다 (틀린 경고보다 경고가 없는 편이 낫다).
const MINUTES_PER_DAY = 24 * 60;
const WEEKDAYS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
const CLOSED_TEXT = '휴무일';
const ALL_DAY_TEXT = '24시간 영업';
const NEXT_DAY_PREFIX = '다음 날';

const toMinutes = (text) => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(text.trim());
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
};

// '11:00~다음 날 09:00' → { from: 660, to: 1980 }. 끝이 시작보다 이르면(18:00~02:00) 다음 날로 본다.
const parseRange = (text) => {
  const [fromText, toText] = text.split('~');
  if (!toText) return null;
  const from = toMinutes(fromText);
  const isNextDay = toText.trim().startsWith(NEXT_DAY_PREFIX);
  let to = toMinutes(toText.replace(NEXT_DAY_PREFIX, ''));
  if (from === null || to === null) return null;
  if (isNextDay || to <= from) to += MINUTES_PER_DAY;
  return { from, to };
};

// 그 요일 영업시간 → 'closed' | 'allDay' | [{ from, to }] | null(모르는 형식)
export function parseDayHours(text) {
  const value = text?.trim();
  if (!value) return null;
  if (value === CLOSED_TEXT) return 'closed';
  if (value === ALL_DAY_TEXT) return 'allDay';
  const ranges = value.split(',').map(parseRange);
  return ranges.every(Boolean) ? ranges : null;
}

// 요일(getDay 0~6)의 영업시간 글자. 줄이 요일 이름으로 시작해서 순서와 상관없이 찾는다.
const findDayText = (openingHours, weekday) => {
  const prefix = `${WEEKDAYS[weekday]}:`;
  const line = openingHours.find((item) => item.startsWith(prefix));
  return line ? line.slice(prefix.length).trim() : null;
};

// 'YYYY-MM-DD' → 요일. new Date('2026-11-10')은 UTC 자정이라 숫자로 나눠 로컬 날짜로 만든다.
const getWeekday = (date) => {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
};

// 그 요일 영업시간을 방문 날 0시 기준 구간으로 옮긴다. offset: 전날 -1440, 다음 날 +1440.
const toRanges = (hours, offset) => {
  if (hours === 'allDay') return [{ from: offset, to: offset + MINUTES_PER_DAY }];
  if (!Array.isArray(hours)) return [];
  return hours.map(({ from, to }) => ({ from: from + offset, to: to + offset }));
};

// start부터 영업 구간이 끊기지 않고 이어지는 데까지(분). start에 열려 있지 않으면 start.
// 겹치거나 맞닿은 구간은 이어서 본다 — 구글은 밤새 여는 곳을 「22:00~24:00」과 다음 날 「00:00~03:00」으로 나눠 적기도 한다.
const findOpenUntil = (ranges, start) =>
  [...ranges]
    .sort((a, b) => a.from - b.from)
    .reduce((reached, { from, to }) => (from <= reached ? Math.max(reached, to) : reached), start);

// 방문(startTime부터 stayMinutes 동안)이 처음부터 끝까지 영업시간 안인지 본다.
// → null(괜찮음·알 수 없음) | { status: 'closed' } | { status: 'outside', hours: '06:00~17:00' }
//   | { status: 'nextDayClosed' } | { status: 'overnight', hours } (자정 넘은 부분이 다음 날 영업시간 밖)
// 전날·그날·다음 날 영업시간을 함께 본다. 전날 밤샘 영업(예: 월 11:00~다음 날 09:00)은 화요일 새벽 방문도 덮고,
// 24시간 영업인 날이라도 자정을 넘겨 다음 날 휴무 시간까지 머물면 알려 준다.
export function checkVisitHours({ openingHours, date, startTime, stayMinutes }) {
  if (!Array.isArray(openingHours) || !date) return null;
  const start = toMinutes(startTime ?? '');
  if (start === null) return null;
  const end = start + Math.max(0, Number(stayMinutes) || 0);

  const weekday = getWeekday(date);
  const todayText = findDayText(openingHours, weekday);
  const tomorrowText = findDayText(openingHours, (weekday + 1) % 7);
  const today = parseDayHours(todayText);
  const tomorrow = parseDayHours(tomorrowText);
  if (today === null) return null;
  // 자정을 넘기는데 다음 날 영업시간을 모르면 판단할 수 없다
  if (end > MINUTES_PER_DAY && tomorrow === null) return null;

  const ranges = [
    ...toRanges(parseDayHours(findDayText(openingHours, (weekday + 6) % 7)), -MINUTES_PER_DAY),
    ...toRanges(today, 0),
    ...toRanges(tomorrow, MINUTES_PER_DAY),
  ];
  const openUntil = findOpenUntil(ranges, start);
  if (openUntil >= end) return null;
  // 끊긴 곳이 자정 전이면 그날 영업시간, 자정 뒤면 다음 날 영업시간 문제다
  if (openUntil < MINUTES_PER_DAY) {
    return today === 'closed' ? { status: 'closed' } : { status: 'outside', hours: todayText };
  }
  return tomorrow === 'closed'
    ? { status: 'nextDayClosed' }
    : { status: 'overnight', hours: tomorrowText };
}
