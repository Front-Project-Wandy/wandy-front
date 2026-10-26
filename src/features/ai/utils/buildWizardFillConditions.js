// 마법사 draft(A)로 AI 빈 일정 채우기 요청 조건을 만든다 (54). 모양은 플래너용 buildFillConditions(55)와 같다.
// days: 마법사의 getTripDays(startDate, endDate) 결과 [{ dayIndex, date }] — 날짜 계산은 마법사 것을 그대로 쓴다.
// flight: 마법사의 toPlanFlight(draft.flight, draft) 결과 { arriveAt, departAt } | null — 항공 모양도 마법사 것을 쓴다.
// 선호 카테고리는 STEP1에서 이번 여행용으로 고른 draft.preferredCategories를 쓴다.
export function buildWizardFillConditions({ draft, days, flight = null }) {
  const spots = draft.spots ?? [];
  const lastDayIndex = days.length - 1;
  // 날짜를 줄여 없어진 DAY의 장소는 마법사처럼 마지막 DAY에 있는 것으로 센다 (spotList.fitSpotsToDays)
  const countSpots = (dayIndex) =>
    spots.filter((spot) => Math.min(spot.dayIndex, lastDayIndex) === dayIndex).length;

  return {
    country: draft.country,
    city: draft.city,
    style: draft.style ?? 'normal',
    preferredCategories: draft.preferredCategories ?? [],
    days: days.map(({ dayIndex, date }) => ({ date, itemCount: countSpots(dayIndex) })),
    excludePlaceIds: spots.map((spot) => spot.placeId),
    flight: flight
      ? { arriveAt: flight.arriveAt ?? null, departAt: flight.departAt ?? null }
      : null,
  };
}
