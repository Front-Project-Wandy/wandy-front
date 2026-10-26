// 담은 장소 목록([{ placeId, dayIndex }])을 바꾸는 함수들. 원래 배열은 건드리지 않고 새 배열을 돌려준다.

// 한 장소는 한 번만 담는다. 이미 있으면 날짜만 옮긴다.
export function putSpot(spots, placeId, dayIndex) {
  const exists = spots.some((spot) => spot.placeId === placeId);
  if (exists) {
    return spots.map((spot) => (spot.placeId === placeId ? { ...spot, dayIndex } : spot));
  }
  return [...spots, { placeId, dayIndex }];
}

// STEP6에서 고른 식당을 기준 장소(afterPlaceId) 바로 다음, 같은 DAY에 끼워 넣는다.
// 한 DAY 안의 순서는 배열 순서라, 기준 장소 바로 뒤 자리에 넣으면 그날 일정에서도 바로 다음이 된다.
// 이미 담은 장소면 원래 자리에서 빼고 옮긴다 (한 장소는 한 번만).
export function insertSpotAfter(spots, afterPlaceId, placeId, dayIndex) {
  const rest = spots.filter((spot) => spot.placeId !== placeId);
  const anchorIndex = rest.findIndex((spot) => spot.placeId === afterPlaceId);
  const nextSpot = { placeId, dayIndex };
  if (anchorIndex === -1) return [...rest, nextSpot];
  return [...rest.slice(0, anchorIndex + 1), nextSpot, ...rest.slice(anchorIndex + 1)];
}

export const removeSpot = (spots, placeId) => spots.filter((spot) => spot.placeId !== placeId);

// AI 빈 일정 채우기(54) 결과를 담은 장소 뒤에 붙인다. aiDays: [{ dayIndex, items: [{ place }] }]
// AI가 한 DAY 안에서 시각 순서로 돌려줘서 그대로 붙이면 그날 순서가 된다.
// AI는 이미 담은 장소를 빼고 고르지만, 혹시 겹쳐도 한 장소가 두 번 담기지 않게 putSpot으로 넣는다.
// 정한 시각(startTime·stayMinutes)은 아직 저장하지 않는다 — 회의 안건 3-1에서 저장 방법을 정한 뒤 붙인다.
export function addAiSpots(spots, aiDays) {
  return aiDays.reduce(
    (result, { dayIndex, items }) =>
      items.reduce((next, { place }) => putSpot(next, place.id, dayIndex), result),
    spots,
  );
}

// 여행 날짜를 줄여 없어진 DAY에 담긴 장소는 마지막 DAY로 옮긴다.
// 플랜 store(C)도 날짜를 줄이면 넘친 장소를 마지막 DAY에 붙여서(buildDays) 같은 규칙으로 맞췄다.
// 날짜가 아직 맞지 않아 DAY가 0개면 건드리지 않는다.
export function fitSpotsToDays(spots, dayCount) {
  if (dayCount === 0) return spots;
  const lastDayIndex = dayCount - 1;
  return spots.map((spot) =>
    spot.dayIndex > lastDayIndex ? { ...spot, dayIndex: lastDayIndex } : spot,
  );
}

export const findSpot = (spots, placeId) => spots.find((spot) => spot.placeId === placeId) ?? null;
