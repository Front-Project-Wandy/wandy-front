// 되돌리기·다시 실행용 기록 (71). 기록은 변경 직전의 trip 통째(스냅샷)이고, 저장소(localStorage)에는 넣지 않는다.
// trip은 바뀔 때마다 새 객체로 만들어져 스냅샷끼리 바뀌지 않은 부분을 나눠 쓰므로 30개를 쌓아도 가볍다.
export const MAX_HISTORY = 30;

export const pushHistory = (past, trip) => [...past, trip].slice(-MAX_HISTORY);

// 좌표 갱신(약관상 30일마다 다시 받는 값)은 사용자가 한 편집이 아니라서 되돌리기에 넣지 않는다.
// 이걸 되돌리면 화면에서 아무것도 바뀌지 않은 것처럼 보여 헷갈린다.
const SYSTEM_FIELDS = ['lat', 'lng', 'coordsCachedAt'];
export const isSystemPatch = (patch) =>
  Object.keys(patch).length > 0 && Object.keys(patch).every((key) => SYSTEM_FIELDS.includes(key));

// patch가 item을 실제로 바꾸는지. 값이 같은 저장은 되돌릴 것이 없으니 기록하지 않는다.
export const isChangingItem = (item, patch) =>
  Object.entries(patch).some(([key, value]) => item[key] !== value);

// 되돌리기: 가장 최근 편집 직전의 trip으로 돌아간다. touch는 updatedAt을 갱신하는 함수다.
// 기록이 다른 여행 것이면(여행을 바꾼 뒤) 기록을 비우고 아무것도 하지 않는다. 되돌릴 게 없으면 state 그대로다.
export const undoState = (state, touch) => {
  const previous = state.past.at(-1);
  if (!state.trip || !previous) return state;
  if (previous.id !== state.trip.id) return { past: [], future: [] };
  return {
    trip: touch(previous),
    past: state.past.slice(0, -1),
    future: [...state.future, state.trip],
  };
};

// 다시 실행: 되돌린 편집을 다시 적용한다. 규칙은 undoState와 같다.
export const redoState = (state, touch) => {
  const next = state.future.at(-1);
  if (!state.trip || !next) return state;
  if (next.id !== state.trip.id) return { past: [], future: [] };
  return {
    trip: touch(next),
    past: pushHistory(state.past, state.trip),
    future: state.future.slice(0, -1),
  };
};
