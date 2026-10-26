// 플랜 store의 trip(C)으로 AI 빈 일정 채우기(55) 요청 조건을 만든다.
// 장소가 이미 있는 DAY는 AI가 건드리지 않고, 이미 넣은 장소는 다시 고르지 않게 넘긴다.
// 항공편이 있으면 도착일·출발일에 비행기 시간과 겹치지 않게 넣도록 도착·출발 일시도 넘긴다.
export function buildFillConditions(trip, preferredCategories = []) {
  return {
    country: trip.country,
    city: trip.city,
    style: trip.style,
    preferredCategories,
    days: trip.days.map((day) => ({ date: day.date, itemCount: day.items.length })),
    excludePlaceIds: trip.days.flatMap((day) => day.items.map((item) => item.placeId)),
    flight: trip.flight
      ? { arriveAt: trip.flight.arriveAt ?? null, departAt: trip.flight.departAt ?? null }
      : null,
  };
}

export const hasEmptyDay = (trip) => trip.days.some((day) => day.items.length === 0);
