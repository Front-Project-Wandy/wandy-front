// 장소를 from 위치에서 꺼내 to 위치에 넣은 새 days를 돌려준다. 위치가 잘못됐으면 null.
// from, to: { dayIndex, index } — to.index는 꺼낸 뒤 목록 기준 위치 (dnd-kit arrayMove와 같다).
// store의 moveItem과, 끄는 동안 화면에 미리 보여 주는 코드(features/trip)가 같이 쓴다.
export const moveItemInDays = (days, from, to) => {
  if (!days[from.dayIndex] || !days[to.dayIndex]) return null;

  const next = days.map((day) => ({ ...day, items: [...day.items] }));
  const [moved] = next[from.dayIndex].items.splice(from.index, 1);
  if (!moved) return null;

  next[to.dayIndex].items.splice(to.index, 0, moved);
  return next;
};
