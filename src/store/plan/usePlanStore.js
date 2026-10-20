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

// 날짜를 바꿔도 같은 날짜의 일정은 남기려고, date로 기존 DAY를 찾아 재사용한다
const buildDays = (startDate, endDate, prevDays = []) =>
  getDateRange(startDate, endDate).map(
    (date) => prevDays.find((day) => day.date === date) ?? { date, items: [] },
  );

const withUpdatedAt = (trip) => ({ ...trip, updatedAt: new Date().toISOString() });

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

// 같은 장소를 여러 날 넣을 수 있어서 place.id가 아니라 새 id를 만든다
const createItem = (place) => ({
  id: crypto.randomUUID(),
  place,
  startTime: '10:00',
  stayMinutes: 90,
  memo: '',
  transportToNext: null,
});

const updateDayItems = (trip, dayIndex, updater) =>
  withUpdatedAt({
    ...trip,
    days: trip.days.map((day, i) => (i === dayIndex ? { ...day, items: updater(day.items) } : day)),
  });

export const usePlanStore = create(
  persist(
    (set) => ({
      trip: null,

      setTripInfo: (info) =>
        set((state) => {
          const base = state.trip ?? createTrip();
          const next = { ...base, ...info };
          next.days = buildDays(next.startDate, next.endDate, base.days);
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
          return { trip: withUpdatedAt({ ...state.trip, days }) };
        }),

      resetTrip: () => set({ trip: null }),
    }),
    {
      name: 'wandy-plan',
      partialize: (state) => ({ trip: state.trip }),
    },
  ),
);
