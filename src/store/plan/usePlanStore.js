import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// toISOString()은 UTC 기준이라 한국 시간에서 하루 어긋날 수 있어 로컬 기준으로 만든다
const toDateString = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return [];
  const [sy, sm, sd] = startDate.split('-').map(Number);
  const [ey, em, ed] = endDate.split('-').map(Number);
  const current = new Date(sy, sm - 1, sd);
  const end = new Date(ey, em - 1, ed);
  const dates = [];
  while (current <= end) {
    dates.push(toDateString(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

// 날짜를 밀어도 일정이 DAY 번호에 붙어 있도록, 날짜가 아니라 순서로 기존 DAY를 이어 붙인다.
// 시작일이 종료일보다 늦는 등 날짜가 아직 맞지 않으면 기존 일정을 지우지 않으려고 그대로 둔다.
const buildDays = (startDate, endDate, prevDays = []) => {
  const dates = getDateRange(startDate, endDate);
  if (dates.length === 0) return prevDays;

  const days = dates.map((date, i) => ({ date, items: prevDays[i]?.items ?? [] }));

  const overflow = prevDays.slice(dates.length).flatMap((day) => day.items);
  if (overflow.length > 0) {
    const last = days[days.length - 1];
    last.items = [...last.items, ...overflow];
  }
  return days;
};

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
  budget: null,
  flight: null,
  stay: null,
  days: [],
  updatedAt: new Date().toISOString(),
});

// 구글 장소는 약관상 place_id와 좌표(캐시 30일)만 저장할 수 있어서 이름·주소·사진·평점은 버린다.
// 화면은 placeId로 장소를 다시 불러와 보여준다.
const createItem = (place) => ({
  id: crypto.randomUUID(),
  placeId: place.id,
  source: place.source,
  name: place.source === 'google' ? null : place.name,
  lat: place.lat,
  lng: place.lng,
  coordsCachedAt: new Date().toISOString(),
  myCategory: place.category,
  startTime: '10:00',
  stayMinutes: 90,
  memo: '',
  transportToNext: null,
});

const updateDayItems = (trip, dayIndex, updater) =>
  withDays(
    trip,
    trip.days.map((day, i) => (i === dayIndex ? { ...day, items: updater(day.items) } : day)),
  );

export const usePlanStore = create(
  persist(
    (set) => ({
      trip: null,

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

      addItem: (dayIndex, place) =>
        set((state) =>
          state.trip
            ? {
                trip: updateDayItems(state.trip, dayIndex, (items) => [
                  ...items,
                  createItem(place),
                ]),
              }
            : state,
        ),

      removeItem: (dayIndex, itemId) =>
        set((state) =>
          state.trip
            ? {
                trip: updateDayItems(state.trip, dayIndex, (items) =>
                  items.filter((item) => item.id !== itemId),
                ),
              }
            : state,
        ),

      updateItem: (dayIndex, itemId, patch) =>
        set((state) =>
          state.trip
            ? {
                trip: updateDayItems(state.trip, dayIndex, (items) =>
                  items.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
                ),
              }
            : state,
        ),

      // from, to: { dayIndex, index } — to.index는 꺼낸 뒤 목록 기준 위치 (dnd-kit arrayMove와 같다)
      moveItem: (from, to) =>
        set((state) => {
          if (!state.trip) return state;

          const days = state.trip.days.map((day) => ({ ...day, items: [...day.items] }));
          if (!days[from.dayIndex] || !days[to.dayIndex]) return state;

          const [moved] = days[from.dayIndex].items.splice(from.index, 1);
          if (!moved) return state;
          days[to.dayIndex].items.splice(to.index, 0, moved);
          return { trip: withDays(state.trip, days) };
        }),

      resetTrip: () => set({ trip: null }),
    }),
    {
      name: 'wandy-plan',
      version: 1,
      // 1단계 개발 중 데이터라 옛 모양(item.place)은 이관하지 않고 비운다
      migrate: () => ({ trip: null }),
      partialize: (state) => ({ trip: state.trip }),
    },
  ),
);
