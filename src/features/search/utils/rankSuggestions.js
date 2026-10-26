import { isSamePlace } from './samePlace';

// 검색 자동완성(43) 후보 순서. 이름만 본다 — 주소까지 맞추는 건 아래 검색 결과가 한다.
// 0: 이름이 검색어로 시작 / 1: 이름 속 단어가 검색어로 시작 / 2: 이름 어딘가에 검색어가 있음
// 같은 순위끼리는 원래 순서(추천·검색 순서)를 지킨다.
export const SUGGESTION_LIMIT = 5;

const normalize = (text = '') => text.replace(/\s+/g, '').toLowerCase();

const getRank = (name, word) => {
  if (normalize(name).startsWith(word)) return 0;
  const words = name.toLowerCase().split(/[\s·・()（）]+/);
  if (words.some((part) => part.startsWith(word))) return 1;
  if (normalize(name).includes(word)) return 2;
  return null;
};

export function rankSuggestions(places, keyword, limit = SUGGESTION_LIMIT) {
  const word = normalize(keyword);
  if (!word) return [];

  const ranked = places
    .map((place, index) => ({ place, index, rank: getRank(place.name, word) }))
    .filter(({ rank }) => rank !== null)
    .sort((a, b) => a.rank - b.rank || a.index - b.index);

  // 같은 장소가 목록에 두 번 있으면(출처만 다르거나 id가 다른 경우) 하나만 남긴다
  const unique = [];
  for (const { place } of ranked) {
    if (!unique.some((item) => isSamePlace(item, place))) unique.push(place);
    if (unique.length === limit) break;
  }
  return unique;
}
