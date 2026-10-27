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

// 방문(startTime부터 stayMinutes 동안)이 영업시간 안인지 본다.
// → null(괜찮음·알 수 없음) | { status: 'closed' } | { status: 'outside', hours: '06:00~17:00' }
// 자정을 넘겨 여는 곳은 전날 영업시간(예: 월 11:00~다음 날 09:00)이 화요일 새벽 방문도 덮는다.
export function checkVisitHours({ openingHours, date, startTime, stayMinutes }) {
  if (!Array.isArray(openingHours) || !date) return null;
  const start = toMinutes(startTime ?? '');
  if (start === null) return null;
  const end = start + Math.max(0, Number(stayMinutes) || 0);

  const weekday = getWeekday(date);
  const todayText = findDayText(openingHours, weekday);
  const today = parseDayHours(todayText);
  const yesterday = parseDayHours(findDayText(openingHours, (weekday + 6) % 7));
  if (today === null) return null;
  if (today === 'allDay') return null;

  const ranges = [
    ...(Array.isArray(today) ? today : []),
    ...(Array.isArray(yesterday)
      ? yesterday.map(({ from, to }) => ({
          from: from - MINUTES_PER_DAY,
          to: to - MINUTES_PER_DAY,
        }))
      : []),
  ];
  if (ranges.some(({ from, to }) => from <= start && end <= to)) return null;
  return today === 'closed' ? { status: 'closed' } : { status: 'outside', hours: todayText };
}
