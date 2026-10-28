// 한 DAY의 장소를 itemIds 순서로 다시 놓는다 (69). 시작 시각은 자리(순서)에 붙어 있어서,
// 장소(체류 시간·메모 포함)만 자리를 옮기고 각 자리의 시작 시각은 그대로 둔다. 그래서 재배치 뒤에도 시간 순서가 뒤바뀌지 않는다.
// itemIds가 지금 장소들과 같은 id의 순서 바꿈이 아니면(빠짐·중복·모르는 id) null이고,
// 순서가 지금과 같으면 바뀐 게 없어서 items 그대로를 돌려준다.
export const reorderItems = (items, itemIds) => {
  if (!Array.isArray(itemIds) || itemIds.length !== items.length) return null;

  const byId = new Map(items.map((item) => [item.id, item]));
  if (byId.size !== items.length || new Set(itemIds).size !== itemIds.length) return null;
  if (itemIds.some((id) => !byId.has(id))) return null;
  if (itemIds.every((id, index) => id === items[index].id)) return items;

  return itemIds.map((id, index) => ({ ...byId.get(id), startTime: items[index].startTime }));
};
