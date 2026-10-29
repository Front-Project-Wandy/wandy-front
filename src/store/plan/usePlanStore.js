import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { stripExpiredCoords } from '../../features/search/utils/coordsCache';
import { moveItemInDays } from './moveItemInDays';
import { buildTripCopy } from './planCopy';
import { buildDays } from './planDays';
import { reorderItems } from './reorderItems';
import { isChangingItem, isSystemPatch, pushHistory, redoState, undoState } from './planHistory';

const withUpdatedAt = (trip) => ({ ...trip, updatedAt: new Date().toISOString() });

// transportToNext는 "다음 장소까지"의 값이라, 다음 장소가 바뀐 항목은 옛 값이 맞지 않는다
const getNextIdMap = (days) => {
  const nextIds = new Map();
  days.forEach((day) => {
    day.items.forEach((item, i) => nextIds.set(item.id, day.items[i + 1]?.id ?? null));
  });
  return nextIds;
};

const clearStaleTransport = (prevDays, nextDays) => {
  const prevNextIds = getNextIdMap(prevDays);
  return nextDays.map((day) => ({
    ...day,
    items: day.items.map((item, i) => {
      const isNextChanged =
        prevNextIds.has(item.id) && prevNextIds.get(item.id) !== (day.items[i + 1]?.id ?? null);
      return isNextChanged ? { ...item, transportToNext: null } : item;
    }),
  }));
};

const withDays = (trip, days) =>
  withUpdatedAt({ ...trip, days: clearStaleTransport(trip.days, days) });

const createTrip = () => ({
  id: crypto.randomUUID(),
  title: '',
  country: null,
  city: null,
  startDate: null,
  endDate: null,
  people: 1,
  style: 'normal',
  companion: null,
  budget: null,
  preferredCategories: [],
  transportMode: null,
  flight: null,
  stay: null,
  days: [],
  updatedAt: new Date().toISOString(),
});

const DEFAULT_START_TIME = '10:00';
const DEFAULT_STAY_MINUTES = 90;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

// 시작 시각·체류 시간은 AI 채우기처럼 미리 정해진 값을 넣을 때만 받는다. 형식이 틀리면 기본값을 쓴다.
// 값의 범위(10~720분)는 입력하는 쪽에서 검사하고, 여기서는 깨진 값이 저장되지 않게만 막는다.
const pickStartTime = (startTime) =>
  TIME_PATTERN.test(startTime) ? startTime : DEFAULT_START_TIME;
const pickStayMinutes = (stayMinutes) =>
  Number.isInteger(stayMinutes) && stayMinutes > 0 ? stayMinutes : DEFAULT_STAY_MINUTES;

// 구글 장소는 약관상 place_id와 좌표(캐시 30일)만 저장할 수 있어서 이름·주소·사진·평점은 버린다.
// 화면은 placeId로 장소를 다시 불러와 보여준다.
const createItem = (place, options = {}) => ({
  id: crypto.randomUUID(),
  placeId: place.id,
  source: place.source,
  name: place.source === 'google' ? null : place.name,
  lat: place.lat,
  lng: place.lng,
  coordsCachedAt: new Date().toISOString(),
  myCategory: place.category,
  startTime: pickStartTime(options.startTime),
  stayMinutes: pickStayMinutes(options.stayMinutes),
  memo: '',
  transportToNext: null,
});

const updateDayItems = (trip, dayIndex, updater) =>
  withDays(
    trip,
    trip.days.map((day, i) => (i === dayIndex ? { ...day, items: updater(day.items) } : day)),
  );

// batchChanges 안에서는 한 번에 한 단계로 묶으려고, 안에서 바뀌는 동안은 기록을 쌓지 않는다.
let isBatching = false;

// 사용자 편집 한 번을 되돌릴 수 있게 변경 직전 trip을 기록하고 다시 실행 목록을 비운다.
// 바뀐 게 없으면(nextTrip이 없거나 그대로) 기록하지 않는다.
const recordChange = (state, nextTrip) => {
  if (!nextTrip || nextTrip === state.trip) return state;
  if (isBatching) return { trip: nextTrip };
  return { trip: nextTrip, past: pushHistory(state.past, state.trip), future: [] };
};

export const usePlanStore = create(
  persist(
    (set, get) => ({
      // 지금 여는 여행. 다른 코드는 모두 이 값을 쓰고, 여러 여행을 지원하기 전과 같다.
      trip: null,
      // 지금 여는 여행(trip)을 뺀 나머지 여행 보관함 (최근에 보관한 순서).
      // 같은 여행을 trip과 trips에 두 곳에 두지 않아서, 둘을 맞춰 줄 코드가 필요 없다.
      trips: [],
      // 되돌리기·다시 실행 기록 (저장하지 않는다). past는 오래된 것부터, future는 되돌린 것부터 쌓는다.
      past: [],
      future: [],

      setTripInfo: (info) =>
        set((state) => {
          const base = state.trip ?? createTrip();
          const next = { ...base, ...info };
          next.days = clearStaleTransport(
            base.days,
            buildDays(next.startDate, next.endDate, base.days),
          );
          return { trip: withUpdatedAt(next) };
        }),

      setFlight: (flight) =>
        set((state) => (state.trip ? { trip: withUpdatedAt({ ...state.trip, flight }) } : state)),

      setStay: (stay) =>
        set((state) => (state.trip ? { trip: withUpdatedAt({ ...state.trip, stay }) } : state)),

      addItem: (dayIndex, place, options) =>
        set((state) =>
          state.trip
            ? recordChange(
                state,
                updateDayItems(state.trip, dayIndex, (items) => [
                  ...items,
                  createItem(place, options),
                ]),
              )
            : state,
        ),

      removeItem: (dayIndex, itemId) =>
        set((state) =>
          state.trip?.days[dayIndex]?.items.some((item) => item.id === itemId)
            ? recordChange(
                state,
                updateDayItems(state.trip, dayIndex, (items) =>
                  items.filter((item) => item.id !== itemId),
                ),
              )
            : state,
        ),

      updateItem: (dayIndex, itemId, patch) =>
        set((state) => {
          if (!state.trip) return state;
          const nextTrip = updateDayItems(state.trip, dayIndex, (items) =>
            items.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
          );
          const target = state.trip.days[dayIndex]?.items.find((item) => item.id === itemId);
          // 좌표 갱신 같은 시스템 변경은 값만 바꾸고 기록하지 않는다. 바뀐 게 없는 저장도 기록하지 않는다.
          if (isSystemPatch(patch)) return { trip: nextTrip };
          return target && isChangingItem(target, patch) ? recordChange(state, nextTrip) : state;
        }),

      // from, to: { dayIndex, index } — to.index는 꺼낸 뒤 목록 기준 위치 (dnd-kit arrayMove와 같다)
      moveItem: (from, to) =>
        set((state) => {
          if (!state.trip) return state;
          // 같은 자리로 옮기면 바뀌는 게 없어서 기록하지 않는다
          if (from.dayIndex === to.dayIndex && from.index === to.index) return state;

          const days = moveItemInDays(state.trip.days, from, to);
          return days ? recordChange(state, withDays(state.trip, days)) : state;
        }),

      // 한 DAY의 장소를 itemIds 순서로 다시 놓는다 (동선 최적화, 69). 시작 시각은 자리에 남고 장소만 옮겨 간다.
      // itemIds가 지금 장소들의 순서 바꿈이 아니거나 순서가 그대로면 아무것도 하지 않고, 바뀌면 되돌리기 한 단계로 남는다.
      reorderDay: (dayIndex, itemIds) =>
        set((state) => {
          const day = state.trip?.days[dayIndex];
          const next = day ? reorderItems(day.items, itemIds) : null;
          if (!next || next === day.items) return state;
          return recordChange(
            state,
            updateDayItems(state.trip, dayIndex, () => next),
          );
        }),

      // 가장 최근 편집을 되돌리고(undo), 되돌린 편집을 다시 적용한다(redo).
      undo: () => set((state) => undoState(state, withUpdatedAt)),
      redo: () => set((state) => redoState(state, withUpdatedAt)),

      // 기록을 비운다. 플래너를 열 때 부른다 (마법사가 저장하면서 넣은 장소는 되돌리기 대상이 아니다).
      clearHistory: () => set({ past: [], future: [] }),

      // apply 안에서 일어나는 여러 번의 편집(AI 채우기 등)을 되돌리기 한 단계로 묶는다.
      batchChanges: (apply) => {
        const before = get().trip;
        isBatching = true;
        try {
          apply();
        } finally {
          isBatching = false;
        }
        set((state) =>
          before && state.trip && state.trip !== before && state.trip.id === before.id
            ? { past: pushHistory(state.past, before), future: [] }
            : state,
        );
      },

      // 여행(id를 생략하면 지금 여는 여행)을 새 날짜(startDate)로 통째로 복사해 새 여행으로 연다 (71).
      // 지금 열려 있던 여행은 보관함으로 가고 원본은 그대로다. 새 여행의 id를 돌려주고, 복사할 수 없으면 null이다.
      duplicateTrip: (id, { title, startDate }) => {
        const { trip, trips } = get();
        const source = !id || id === trip?.id ? trip : trips.find((item) => item.id === id);
        const copy = buildTripCopy(source, { title, startDate }, () => crypto.randomUUID());
        if (!copy) return null;

        set({ trip: copy, trips: trip ? [trip, ...trips] : trips, past: [], future: [] });
        return copy.id;
      },

      // 지금 여는 여행을 지운다 (보관함은 그대로).
      resetTrip: () => set({ trip: null, past: [], future: [] }),

      // 새 여행을 만들기 전에 부른다: 지금 여행을 보관함으로 보내고 비운다. 뒤이어 setTripInfo가 새 여행을 만든다.
      startNewTrip: () =>
        set((state) => ({
          trip: null,
          trips: state.trip ? [state.trip, ...state.trips] : state.trips,
          past: [],
          future: [],
        })),

      // 보관함의 여행을 지금 여는 여행으로 바꾼다. 원래 열려 있던 여행은 보관함으로 간다.
      selectTrip: (id) =>
        set((state) => {
          const target = state.trips.find((item) => item.id === id);
          if (!target) return state;
          const rest = state.trips.filter((item) => item.id !== id);
          return {
            trip: target,
            trips: state.trip ? [state.trip, ...rest] : rest,
            past: [],
            future: [],
          };
        }),

      // 지금 여는 여행이면 비우고, 보관함의 여행이면 보관함에서 뺀다.
      deleteTrip: (id) =>
        set((state) =>
          state.trip?.id === id
            ? { trip: null, past: [], future: [] }
            : { trips: state.trips.filter((item) => item.id !== id) },
        ),
    }),
    {
      name: 'wandy-plan',
      version: 2,
      // v1(여행 하나)은 모양이 같아서 그대로 살리고 보관함만 비워 둔다.
      // 그보다 옛 모양(item.place)은 1단계 개발 중 데이터라 이관하지 않고 비운다.
      migrate: (persisted, version) => ({
        trip: version === 1 ? (persisted?.trip ?? null) : null,
        trips: [],
      }),
      partialize: (state) => ({ trip: state.trip, trips: state.trips }),
      // 구글 장소 좌표는 30일까지만 둘 수 있어서(약관), 저장소에서 불러올 때 만료된 좌표를 지운다.
      // 지금 여는 여행과 보관함 모두 해당한다. 지운 좌표는 그 여행을 플래너에서 열 때 다시 받아 온다.
      merge: (persisted, current) => ({
        ...current,
        trip: persisted?.trip ? stripExpiredCoords(persisted.trip) : current.trip,
        trips: (persisted?.trips ?? current.trips).map((item) => stripExpiredCoords(item)),
      }),
    },
  ),
);
