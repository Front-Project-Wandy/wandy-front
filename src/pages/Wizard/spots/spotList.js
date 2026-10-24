// 담은 장소 목록([{ placeId, dayIndex }])을 바꾸는 함수들. 원래 배열은 건드리지 않고 새 배열을 돌려준다.

// 한 장소는 한 번만 담는다. 이미 있으면 날짜만 옮긴다.
export function putSpot(spots, placeId, dayIndex) {
  const exists = spots.some((spot) => spot.placeId === placeId);
  if (exists) {
    return spots.map((spot) => (spot.placeId === placeId ? { ...spot, dayIndex } : spot));
  }
  return [...spots, { placeId, dayIndex }];
}

export const removeSpot = (spots, placeId) => spots.filter((spot) => spot.placeId !== placeId);

export const findSpot = (spots, placeId) => spots.find((spot) => spot.placeId === placeId) ?? null;
