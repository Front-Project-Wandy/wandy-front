import { getFlightTimeWarnings } from '../../trip/utils/checkFlightTime';

// AI 일정 검증 (55). AI가 지어낸 장소·잘못된 값은 빼고, 실제 장소 데이터(Place)로 바꿔서 돌려준다.
// 한국은 Gemini가 한국 장소를 잘 모르므로 우리 장소 데이터에 이름이 있는 곳만 남긴다 (요구사항 55).
// raw: { days: [{ dayIndex, items: [{ name, startTime, stayMinutes }] }] }
// → { days: [{ dayIndex, items: [{ place, startTime, stayMinutes }] }], droppedCount }

const DEFAULT_STAY_MINUTES = 90;
const MIN_STAY_MINUTES = 10;
const MAX_STAY_MINUTES = 600;

const isValidTime = (time) => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(typeof time === 'string' ? time : '');
  return Boolean(match) && Number(match[1]) <= 23 && Number(match[2]) <= 59;
};

// '9:30'처럼 와도 정렬·표시가 같게 'HH:MM'으로 맞춘다.
const padTime = (time) => time.padStart(5, '0');

const normalizeName = (name) => (typeof name === 'string' ? name.replace(/\s+/g, '') : '');

const toStayMinutes = (value) => {
  const minutes = Math.round(Number(value));
  if (!Number.isFinite(minutes)) return DEFAULT_STAY_MINUTES;
  return Math.min(MAX_STAY_MINUTES, Math.max(MIN_STAY_MINUTES, minutes));
};

// candidates: 그 도시의 장소 전체 (placeService.getCityPlaces)
// excludePlaceIds: 이미 일정에 있는 장소 — AI가 다시 넣어도 빼서 중복을 막는다.
// dayCount: 여행 날짜 수 — 없는 DAY 번호는 뺀다.
// dayDates·flight: DAY별 날짜와 항공편 — 플래너가 항공 시간 경고(48)를 띄울 일정은 뺀다.
export function validateItinerary(
  raw,
  candidates,
  { excludePlaceIds = [], dayCount, dayDates = [], flight = null } = {},
) {
  const byName = new Map();
  for (const place of candidates) {
    const key = normalizeName(place.name);
    if (!byName.has(key)) byName.set(key, place);
  }
  const used = new Set(excludePlaceIds);
  let droppedCount = 0;
  const days = [];

  for (const day of Array.isArray(raw?.days) ? raw.days : []) {
    const dayIndex = day?.dayIndex;
    const items = Array.isArray(day?.items) ? day.items : [];
    const isValidDay =
      Number.isInteger(dayIndex) &&
      dayIndex >= 0 &&
      (dayCount === undefined || dayIndex < dayCount);
    if (!isValidDay) {
      droppedCount += items.length;
      continue;
    }

    const date = dayDates[dayIndex];
    const validItems = [];
    for (const item of items) {
      const place = byName.get(normalizeName(item?.name));
      if (!place || used.has(place.id) || !isValidTime(item.startTime)) {
        droppedCount += 1;
        continue;
      }
      const startTime = padTime(item.startTime);
      const stayMinutes = toStayMinutes(item.stayMinutes);
      const isOutsideFlight =
        Boolean(date) &&
        getFlightTimeWarnings({ flight, date, item: { startTime, stayMinutes } }).length > 0;
      if (isOutsideFlight) {
        droppedCount += 1;
        continue;
      }
      used.add(place.id);
      validItems.push({ place, startTime, stayMinutes });
    }
    validItems.sort((a, b) => a.startTime.localeCompare(b.startTime));
    if (validItems.length > 0) days.push({ dayIndex, items: validItems });
  }

  return { days, droppedCount };
}
