// 장소 상세에 붙이는 일정 연관 상품 추천 (84).
export const PLACE_PRODUCT_LIMIT = 3;

// 장소 카테고리(Place.category)와 상품 종류(PRODUCT_CATEGORIES)는 값이 달라서 바로 비교할 수 없다.
// 그 장소에 가는 사람이 같이 고를 만한 상품 종류를 정해 둔다.
// - sight: 명소는 해설 투어나 입장권을 같이 산다.
// - nature·night: 공원·강·야경은 걷기·야경 투어나 크루즈 같은 야외 활동과 묶인다.
// - food: 목업에서 먹거리 투어가 액티비티로 분류돼 있다.
// - cafe: 카페 거리는 사진을 찍으러 많이 가서 스냅 촬영과 어울린다.
// - shop: 쇼핑은 여러 곳을 돌아다녀서 교통패스가 쓸모 있다.
// onsen은 어울리는 상품 종류가 아직 없어서 넣지 않는다 — 평점 순으로만 고른다.
export const PLACE_TO_PRODUCT_CATEGORIES = {
  sight: ['tour', 'ticket'],
  nature: ['tour', 'activity'],
  night: ['tour', 'activity'],
  food: ['activity'],
  cafe: ['snap'],
  shop: ['pass'],
};

// 평점 높은 순, 같으면 후기가 많은 쪽 먼저 (DAY 추천 pickDayProducts도 같이 쓴다)
export const byRating = (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount;

// 같은 도시 상품 중 카테고리가 맞는 것을 먼저, 그다음 평점 높은 순으로 최대 limit개.
// 평점이 같으면 후기가 많은 쪽을 앞에 둬서 순서가 매번 같게 한다.
export function pickPlaceProducts(place, products, limit = PLACE_PRODUCT_LIMIT) {
  const matched = PLACE_TO_PRODUCT_CATEGORIES[place.category] ?? [];
  const isMatched = (product) => (matched.includes(product.category) ? 1 : 0);

  return products
    .filter((product) => product.country === place.country && product.city === place.city)
    .sort((a, b) => isMatched(b) - isMatched(a) || byRating(a, b))
    .slice(0, limit);
}
