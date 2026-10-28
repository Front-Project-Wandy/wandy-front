import { PRODUCT_RANK_LIMIT } from '../constants';

// 평점 상위 상품의 순위표 (id → 1, 2, 3 …). 평점이 같으면 후기가 많은 쪽을 앞에 둔다.
// 목록 순서는 그대로 두고 배지만 다는 데 쓴다 — 정렬을 바꾸면 [더보기]로 나눠 보는 순서가 흔들린다.
export function rankProducts(products, limit = PRODUCT_RANK_LIMIT) {
  const ranked = [...products]
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, limit);
  return new Map(ranked.map((product, index) => [product.id, index + 1]));
}
