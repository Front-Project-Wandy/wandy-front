import { moveItemInDays } from '../../../store/plan/moveItemInDays';

// DAY 칸(장소가 없거나 맨 끝에 놓을 때 쓰는 자리)의 드롭 id. 장소 id는 uuid(16진수)라 'day-'로 시작할 수 없다.
const DAY_DROP_PREFIX = 'day-';

export const getDayDropId = (dayIndex) => `${DAY_DROP_PREFIX}${dayIndex}`;

export const parseDayDropId = (id) =>
  typeof id === 'string' && id.startsWith(DAY_DROP_PREFIX)
    ? Number(id.slice(DAY_DROP_PREFIX.length))
    : null;

export const findItemPosition = (days, itemId) => {
  for (let dayIndex = 0; dayIndex < days.length; dayIndex += 1) {
    const index = days[dayIndex].items.findIndex((item) => item.id === itemId);
    if (index !== -1) return { dayIndex, index };
  }
  return null;
};

// 놓는 자리(over)의 위치. 장소 위면 그 장소의 자리, DAY 칸 위면 그 DAY의 맨 끝.
const getOverPosition = (days, overId) => {
  const dayIndex = parseDayDropId(overId);
  if (dayIndex !== null) {
    return days[dayIndex] ? { dayIndex, index: days[dayIndex].items.length } : null;
  }
  return findItemPosition(days, overId);
};

// 끄는 도중, 다른 DAY의 장소 위로 넘어가면 그 DAY에 미리 넣어 보여 준다 (자리가 벌어지는 모습을 보이려고).
// 같은 DAY 안의 순서는 sortable이 알아서 보여 주므로 여기서는 다루지 않는다. 바뀔 게 없으면 null.
// 장소가 이미 있는 DAY의 칸(제목·빈틈)을 지나갈 때는 미리 옮기지 않는다. 지나가기만 해도 맨 끝으로 튀어 들어가는 걸 막는다.
// 장소가 없는 DAY는 놓을 곳이 그 칸뿐이라 바로 넣는다.
export const previewCrossDayMove = (days, activeId, overId, isBelowOver) => {
  const from = findItemPosition(days, activeId);
  const over = getOverPosition(days, overId);
  if (!from || !over || from.dayIndex === over.dayIndex) return null;

  const isOverItem = parseDayDropId(overId) === null;
  if (!isOverItem && days[over.dayIndex].items.length > 0) return null;

  const index = isOverItem && isBelowOver ? over.index + 1 : over.index;
  return moveItemInDays(days, from, { dayIndex: over.dayIndex, index });
};

// 놓았을 때 같은 DAY 안의 순서를 확정한다. DAY 칸 위에 놓으면 그 DAY의 맨 끝으로 간다.
const applySameDayMove = (days, activeId, overId) => {
  const from = findItemPosition(days, activeId);
  const over = getOverPosition(days, overId);
  if (!from || !over || from.dayIndex !== over.dayIndex) return days;

  const toIndex =
    parseDayDropId(overId) !== null ? days[over.dayIndex].items.length - 1 : over.index;
  if (toIndex === from.index) return days;
  return moveItemInDays(days, from, { dayIndex: from.dayIndex, index: toIndex }) ?? days;
};

// 놓은 자리를 확정한다. 미리 옮겨 보여 주지 않고 놓은 경우(다른 DAY의 칸 위, 빠르게 놓음)도 여기서 옮긴다.
export const settleDrop = (days, activeId, overId, isBelowOver) => {
  const from = findItemPosition(days, activeId);
  const over = getOverPosition(days, overId);
  if (!from || !over) return days;
  if (from.dayIndex === over.dayIndex) return applySameDayMove(days, activeId, overId);

  const isOverItem = parseDayDropId(overId) === null;
  const index = isOverItem && isBelowOver ? over.index + 1 : over.index;
  return moveItemInDays(days, from, { dayIndex: over.dayIndex, index }) ?? days;
};
