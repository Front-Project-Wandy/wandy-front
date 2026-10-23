import { PLACE_CATEGORIES } from '../place';

// 비선호 장소도 남기고 같은 그룹 안에서는 기존 추천 순서를 유지한다.
// Query 캐시를 공유하는 다른 화면에 영향을 주지 않도록 원본 배열은 바꾸지 않는다.
export function prioritizePreferredPlaces(places, preferredCategories) {
  const categories = new Set(
    Array.isArray(preferredCategories)
      ? preferredCategories.filter((category) => PLACE_CATEGORIES.includes(category))
      : [],
  );
  if (categories.size === 0) return places;

  const preferred = [];
  const others = [];
  for (const place of places) {
    (categories.has(place.category) ? preferred : others).push(place);
  }
  return [...preferred, ...others];
}
