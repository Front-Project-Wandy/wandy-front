// entries: [{ place, searchText }] — searchText는 원본 응답의 분류 글자(예: '음식점>한식')처럼
// Place에는 없지만 검색어로 찾을 수 있어야 하는 글자다.
export function filterPlaces(entries, { keyword = '', category = null } = {}) {
  const word = keyword.trim().toLowerCase();
  return entries
    .filter(({ place }) => !category || place.category === category)
    .filter(({ place, searchText = '' }) => {
      if (!word) return true;
      return `${place.name} ${place.address} ${searchText}`.toLowerCase().includes(word);
    })
    .map(({ place }) => place);
}
