import { findItemByRef } from './buildAssistantContext';

// 대화형 여행 비서(101)가 제안한 일정 변경을 확인해서, 실제로 적용할 수 있는 것만 남긴다.
// 없는 장소·없는 DAY·지어낸 ref, 같은 장소를 두 번 고치는 제안은 빼고 몇 개 뺐는지 droppedCount로 알린다.
// raw: [{ type, ref, placeName, day, startTime, stayMinutes }] (Gemini 응답 또는 가짜 비서)
// → { actions: [
//      { type: 'add', dayIndex, place, startTime, stayMinutes }
//      { type: 'remove', dayIndex, itemId }
//      { type: 'move', dayIndex, itemId, toDayIndex }
//      { type: 'updateTime', dayIndex, itemId, patch: { startTime?, stayMinutes? } } ], droppedCount }

const DEFAULT_START_TIME = '10:00';
const DEFAULT_STAY_MINUTES = 90;
const MIN_STAY_MINUTES = 10;
const MAX_STAY_MINUTES = 600;
// 한 번에 너무 많이 바꾸면 미리보기를 확인하기 어려워서 이만큼만 받는다
const MAX_ACTIONS = 10;

const normalizeName = (name) =>
  typeof name === 'string' ? name.replace(/\s+/g, '').toLowerCase() : '';

// '9:30' → '09:30'. 형식이 틀리면 null
const toTime = (value) => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(typeof value === 'string' ? value.trim() : '');
  if (!match || Number(match[1]) > 23 || Number(match[2]) > 59) return null;
  return `${match[1].padStart(2, '0')}:${match[2]}`;
};

const toStayMinutes = (value) => {
  const minutes = Math.round(Number(value));
  if (!Number.isFinite(minutes) || minutes <= 0) return null;
  return Math.min(MAX_STAY_MINUTES, Math.max(MIN_STAY_MINUTES, minutes));
};

// 괄호 속 설명("센소지 (아사쿠사)"의 "(아사쿠사)")을 뺀 장소 이름
const coreName = (name) =>
  normalizeName(typeof name === 'string' ? name.replace(/[(（][^)）]*[)）]/g, '') : '');

// 일부만 맞는 이름을 받는 기준. 짧은 말("공원"·"시장"·"도쿄")이나 지역 이름("아사쿠사" → 아사쿠사 규카츠)이
// 아무 장소에나 붙지 않게, 3글자 이상이고 장소 이름의 대부분(60% 이상)을 덮을 때만 받는다.
const MIN_PARTIAL_NAME_LENGTH = 3;
const MIN_PARTIAL_NAME_COVERAGE = 0.6;

const isPartialMatch = (target, name) => {
  if (target.includes(name)) return name.length >= MIN_PARTIAL_NAME_LENGTH;
  return (
    name.includes(target) &&
    target.length >= MIN_PARTIAL_NAME_LENGTH &&
    target.length / name.length >= MIN_PARTIAL_NAME_COVERAGE
  );
};

// 이름이 같은 곳(괄호 설명은 빼고)을 먼저 찾고, 없으면 거의 같은 이름("센소지 절" → 센소지)을 찾는다.
// 거의 같은 후보가 여럿이면 어느 곳인지 알 수 없어서 고르지 않는다.
const findCandidate = (candidates, placeName) => {
  const target = normalizeName(placeName);
  if (!target) return null;
  const exact = candidates.find(
    (place) => normalizeName(place.name) === target || coreName(place.name) === target,
  );
  if (exact) return exact;
  const partial = candidates.filter((place) => isPartialMatch(target, coreName(place.name)));
  return partial.length === 1 ? partial[0] : null;
};

const toDayIndex = (trip, day) => {
  const dayIndex = Number(day) - 1;
  return Number.isInteger(dayIndex) && trip.days[dayIndex] ? dayIndex : null;
};

const validateOne = (raw, { trip, candidates, plannedPlaceIds }) => {
  if (raw?.type === 'add') {
    const place = findCandidate(candidates, raw.placeName);
    const dayIndex = toDayIndex(trip, raw.day ?? 1);
    if (!place || dayIndex === null || plannedPlaceIds.has(place.id)) return null;
    return {
      type: 'add',
      dayIndex,
      place,
      startTime: toTime(raw.startTime) ?? DEFAULT_START_TIME,
      stayMinutes: toStayMinutes(raw.stayMinutes) ?? DEFAULT_STAY_MINUTES,
    };
  }

  const found = findItemByRef(trip, raw?.ref);
  if (!found) return null;
  const { dayIndex, item } = found;

  if (raw.type === 'remove') return { type: 'remove', dayIndex, itemId: item.id };
  if (raw.type === 'move') {
    const targetDayIndex = toDayIndex(trip, raw.day);
    if (targetDayIndex === null || targetDayIndex === dayIndex) return null;
    return { type: 'move', dayIndex, itemId: item.id, toDayIndex: targetDayIndex };
  }
  if (raw.type === 'updateTime') {
    const patch = {};
    const startTime = toTime(raw.startTime);
    const stayMinutes = toStayMinutes(raw.stayMinutes);
    if (startTime && startTime !== item.startTime) patch.startTime = startTime;
    if (stayMinutes && stayMinutes !== item.stayMinutes) patch.stayMinutes = stayMinutes;
    return Object.keys(patch).length > 0
      ? { type: 'updateTime', dayIndex, itemId: item.id, patch }
      : null;
  }
  return null;
};

// plannedPlaceIds: 이미 일정에 있는 장소 id (같은 장소의 다른 출처 id까지, placeService.withSamePlaceIds).
//   없으면 일정의 placeId만 본다.
export const validateAssistantActions = (
  rawActions,
  { trip, candidates, plannedPlaceIds: planned },
) => {
  const list = Array.isArray(rawActions) ? rawActions : [];
  const plannedPlaceIds = new Set(
    planned ?? trip.days.flatMap((day) => day.items.map((item) => item.placeId)),
  );
  const touchedItemIds = new Set();
  const actions = [];

  list.slice(0, MAX_ACTIONS).forEach((raw) => {
    const action = validateOne(raw, { trip, candidates, plannedPlaceIds });
    if (!action) return;
    // 같은 장소를 두 번 고치면 어느 쪽이 맞는지 알 수 없어서 처음 것만 쓴다. 같은 곳을 두 번 넣는 것도 막는다.
    const key = action.type === 'add' ? `add:${action.place.id}` : action.itemId;
    if (touchedItemIds.has(key)) return;
    touchedItemIds.add(key);
    if (action.type === 'add') plannedPlaceIds.add(action.place.id);
    actions.push(action);
  });

  return { actions, droppedCount: list.length - actions.length };
};
