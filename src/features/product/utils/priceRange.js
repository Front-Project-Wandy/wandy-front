// 상품 1인 가격대 필터 (73). 경계는 원 기준이고, 엔화 상품은 원으로 바꿔서 같은 칸에 넣는다.

// 1엔 = 9원 (100엔 ≈ 900원, 2025~2026년 대략 값).
// 1단계에는 환율 API가 없어서 고정값으로 둔다. 칸 경계가 만 원 단위로 굵어서
// 환율이 몇 % 움직여도 대부분 상품은 같은 칸에 남는다. 2단계에서 서버가 환율을 주면 이 표만 바꾼다.
export const KRW_PER_CURRENCY = { KRW: 1, JPY: 9 };

// key는 마법사 예산(BUDGET_RANGES)처럼 만 원 단위 이름. min은 포함, max는 포함하지 않는다.
export const PRICE_RANGES = [
  { key: 'under30', min: 0, max: 30000 },
  { key: '30to70', min: 30000, max: 70000 },
  { key: 'over70', min: 70000, max: Infinity },
];

export const PRICE_RANGE_KEYS = PRICE_RANGES.map((range) => range.key);

// 표에 없는 통화는 원으로 바꿀 수 없어서 null — 어느 가격대에도 넣지 않는다.
export function toKrw(price, currency) {
  const rate = KRW_PER_CURRENCY[currency];
  return rate ? price * rate : null;
}

// rangeKey가 없으면(전체) 그대로 돌려준다.
export function filterByPriceRange(products, rangeKey) {
  const range = PRICE_RANGES.find((item) => item.key === rangeKey);
  if (!range) return products;
  return products.filter((product) => {
    const krw = toKrw(product.price, product.currency);
    return krw !== null && krw >= range.min && krw < range.max;
  });
}
