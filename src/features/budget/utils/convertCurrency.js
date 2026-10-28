import { KRW_PER_CURRENCY } from '../../product/utils/priceRange';
import { TOTAL_ROUND_UNIT } from '../constants';

// 환율은 상품 가격대 필터(73)와 같은 고정값을 가져다 써서 기준을 하나로 둔다 (1엔 = 9원).
// 2단계에서 서버가 환율을 주면 그쪽 표만 바꾸면 여기도 같이 바뀐다.
export const getKrwPerJpy = () => KRW_PER_CURRENCY.JPY;

// amount를 from 통화에서 to 통화로 바꾼다 ('KRW' | 'JPY'). 모르는 통화면 null이다.
export const convertCurrency = (amount, from, to) => {
  if (!KRW_PER_CURRENCY[from] || !KRW_PER_CURRENCY[to]) return null;
  if (from === to) return amount;
  const converted = (amount * KRW_PER_CURRENCY[from]) / KRW_PER_CURRENCY[to];
  return Math.round(converted / TOTAL_ROUND_UNIT) * TOTAL_ROUND_UNIT;
};
