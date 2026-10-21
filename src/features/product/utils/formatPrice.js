// 가격을 화면용 숫자로 (천 단위 쉼표). 단위 글자(원·엔)는 번역 키 product.price.{currency}에서 붙인다.
export function formatPrice(price) {
  return price.toLocaleString('ko-KR');
}
