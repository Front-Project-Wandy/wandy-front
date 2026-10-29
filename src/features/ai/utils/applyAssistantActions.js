// 확인한 비서 제안(validateAssistantActions 결과)을 플랜 store에 넣는다 (101).
// batchChanges로 묶어서 되돌리기 한 번에 모두 취소된다.
// 제안을 받은 뒤 사용자가 직접 일정을 고쳤을 수 있어서, 위치는 적용하는 순간의 store에서 itemId로 다시 찾는다.
// 없어진 장소에 대한 제안은 조용히 건너뛴다.
// 넣거나 옮기거나 시각을 바꾼 장소는 그 DAY의 시작 시각 순서 자리로 옮긴다. 끝에 붙이기만 하면
// 08:30 장소가 13:00 뒤에 와서 순서 경고가 뜨고 지도 동선 번호도 틀어진다.

const locate = (trip, itemId) => {
  for (let dayIndex = 0; dayIndex < trip.days.length; dayIndex += 1) {
    const index = trip.days[dayIndex].items.findIndex((item) => item.id === itemId);
    if (index >= 0) return { dayIndex, index };
  }
  return null;
};

// 장소를 시작 시각 순서 자리로 옮긴다. 같은 시각이면 원래 있던 장소 뒤에 둔다.
const placeByTime = (planStore, itemId) => {
  const state = planStore.getState();
  const from = locate(state.trip, itemId);
  if (!from) return;
  const items = state.trip.days[from.dayIndex].items;
  const { startTime } = items[from.index];
  const others = items.filter((item) => item.id !== itemId);
  const later = others.findIndex((item) => item.startTime > startTime);
  const index = later >= 0 ? later : others.length;
  if (index !== from.index) state.moveItem(from, { dayIndex: from.dayIndex, index });
};

// planStore: usePlanStore (getState로 그때그때 최신 값을 읽는다)
export const applyAssistantActions = (planStore, actions) => {
  const { batchChanges } = planStore.getState();
  batchChanges(() => {
    // 시간 변경 → 빼기 → 옮기기 → 넣기 순서로 해서, 앞의 변경이 뒤의 위치 계산을 흐트러뜨리지 않게 한다
    const order = ['updateTime', 'remove', 'move', 'add'];
    order.forEach((type) => {
      actions
        .filter((action) => action.type === type)
        .forEach((action) => {
          const state = planStore.getState();
          if (type === 'add') {
            if (!state.trip.days[action.dayIndex]) return;
            state.addItem(action.dayIndex, action.place, {
              startTime: action.startTime,
              stayMinutes: action.stayMinutes,
            });
            // addItem은 그 DAY 맨 끝에 붙이므로 마지막 장소가 방금 넣은 곳이다
            const added = planStore.getState().trip.days[action.dayIndex].items.at(-1);
            if (added) placeByTime(planStore, added.id);
            return;
          }
          const from = locate(state.trip, action.itemId);
          if (!from) return;
          if (type === 'updateTime') {
            state.updateItem(from.dayIndex, action.itemId, action.patch);
            if (action.patch.startTime) placeByTime(planStore, action.itemId);
          }
          if (type === 'remove') state.removeItem(from.dayIndex, action.itemId);
          if (type === 'move' && state.trip.days[action.toDayIndex]) {
            state.moveItem(from, {
              dayIndex: action.toDayIndex,
              index: state.trip.days[action.toDayIndex].items.length,
            });
            placeByTime(planStore, action.itemId);
          }
        });
    });
  });
};
