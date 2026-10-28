// 장소 데이터에 가격이 없어서 입장료·식비는 카테고리별 1인 평균 "추정치"를 쓴다 (요구사항 #57).
// 교통(estimateTransport)처럼 정확한 값이 아니라서 화면에는 항상 「약」으로 보여 준다.
// 2단계에서 장소 API(TourAPI 이용요금 등)로 실제 값을 받게 되면 이 표만 바꾸면 된다. 금액은 나라 통화 기준이다.
export const COUNTRY_CURRENCY = { KR: 'KRW', JP: 'JPY' };

// 입장료: 들어가는 곳만. 자연·쇼핑은 보통 입장료가 없어서 표에 없으면 0으로 본다.
export const ENTRY_FEE = {
  KR: { sight: 3000, night: 15000, onsen: 15000 },
  JP: { sight: 800, night: 1500, onsen: 1500 },
};

// 식비: 일정에 담은 식당(food)·카페(cafe)만 센다. 담지 않은 끼니는 알 수 없어서 넣지 않는다.
export const MEAL_COST = {
  KR: { food: 12000, cafe: 6000 },
  JP: { food: 1200, cafe: 600 },
};

// 합계와 환산 금액은 정확하지 않아서 이 단위로 반올림해 보여 준다
export const TOTAL_ROUND_UNIT = 10;
