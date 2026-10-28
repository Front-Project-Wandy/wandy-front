import { buildFillConditions } from './buildFillConditions';

// 특정 DAY 다시 짜기 (79). 플래너 trip에서 그 DAY만 비운 것처럼 AI 요청 조건을 만든다.
// AI 채우기는 장소가 없는 DAY만 채워서, 다시 짤 DAY는 itemCount 0으로, 나머지는 비어 있어도 1 이상으로 둔다
// (다른 빈 DAY까지 같이 채우지 않게).
// 그 DAY에 있던 장소는 제외 목록에 그대로 남긴다 — 같은 조건이면 같은 일정이 다시 나와서 다시 짜는 의미가 없다.
// 결과를 넣을 때 그 DAY의 기존 장소를 빼고 넣는 건 부르는 쪽(플래너)이 한다.
export function buildDayRegenerateConditions(trip, dayIndex, preferredCategories = []) {
  const conditions = buildFillConditions(trip, preferredCategories);
  return {
    ...conditions,
    days: conditions.days.map((day, index) => ({
      ...day,
      itemCount: index === dayIndex ? 0 : Math.max(day.itemCount, 1),
    })),
  };
}
