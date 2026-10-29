import { byRating, PLACE_TO_PRODUCT_CATEGORIES } from './pickPlaceProducts';

// 플래너 DAY에 붙이는 일정 연관 상품 추천 (84). 그날 담은 장소들과 어울리는 상품을 고른다.
export const DAY_PRODUCT_LIMIT = 2;

// day: { country, city, categories: 그날 장소의 myCategory 목록 }
// 장소 카테고리마다 어울리는 상품 종류(PLACE_TO_PRODUCT_CATEGORIES)에 1점씩 주고,
// 같은 도시 상품 중 점수가 높은 종류 → 평점 순으로 최대 limit개. 어울리는 종류가 없으면 []
// (장소 상세와 달리 아무 상품이나 채우지 않는다 — 일정 화면에서 관련 없는 광고처럼 보이지 않게).
export function pickDayProducts(
  { country, city, categories },
  products,
  limit = DAY_PRODUCT_LIMIT,
) {
  const scores = new Map();
  categories.forEach((category) =>
    (PLACE_TO_PRODUCT_CATEGORIES[category] ?? []).forEach((productCategory) =>
      scores.set(productCategory, (scores.get(productCategory) ?? 0) + 1),
    ),
  );
  if (scores.size === 0) return [];

  return products
    .filter(
      (product) =>
        product.country === country && product.city === city && scores.has(product.category),
    )
    .sort((a, b) => scores.get(b.category) - scores.get(a.category) || byRating(a, b))
    .slice(0, limit);
}
