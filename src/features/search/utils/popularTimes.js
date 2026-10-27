// 혼잡도·인기 시간대 (99). 구글 Places API(공식)에는 장소별 혼잡도가 없고 크롤링은 금지라서,
// 장소 카테고리로 "보통 이 시간에 붐빈다"를 추정한다. 화면에도 추정값이라고 같이 적는다.
// 값은 0~100 상대 혼잡도. 2단계에서 실제 방문 데이터(예: 우리 서비스의 일정 시각)가 쌓이면 이 표만 바꾼다.

export const POPULAR_HOURS = Array.from({ length: 18 }, (_, index) => index + 6); // 6시~23시
export const POPULAR_LEVEL_COUNT = 5; // 0(한산)~4(매우 붐빔)

// 카테고리마다 붐비는 시간대 [시작 시, 끝 시(포함), 혼잡도]. 겹치면 큰 값을 쓴다.
// - sight·nature: 오전 늦게~오후 / food: 점심·저녁 / cafe: 점심 뒤 오후 / shop: 오후~저녁
// - night: 해가 진 뒤 / onsen: 저녁~밤
const CATEGORY_PEAKS = {
  sight: [
    [9, 10, 40],
    [11, 15, 85],
    [16, 17, 50],
  ],
  nature: [
    [7, 9, 30],
    [10, 15, 75],
    [16, 18, 40],
  ],
  food: [
    [11, 11, 50],
    [12, 13, 100],
    [14, 16, 25],
    [17, 17, 55],
    [18, 20, 95],
    [21, 22, 40],
  ],
  cafe: [
    [9, 11, 35],
    [12, 13, 60],
    [14, 17, 90],
    [18, 20, 40],
  ],
  shop: [
    [10, 12, 40],
    [13, 19, 85],
    [20, 21, 45],
  ],
  night: [
    [17, 18, 40],
    [19, 22, 90],
    [23, 23, 50],
  ],
  onsen: [
    [10, 14, 35],
    [15, 17, 55],
    [18, 22, 90],
  ],
};
// 주말에는 관광·쇼핑처럼 쉬는 날 몰리는 곳이 더 붐빈다
const WEEKEND_BOOST = { sight: 1.2, nature: 1.3, cafe: 1.2, shop: 1.25 };
const BASE_LEVEL = 10;

const toLevel = (value) =>
  Math.min(POPULAR_LEVEL_COUNT - 1, Math.floor(value / (100 / POPULAR_LEVEL_COUNT)));

// category: Place.category, isWeekend: 토·일이면 true
// → null(모르는 카테고리) | { hours: [{ hour, value, level }], peak: { from, to } }
// peak는 가장 붐비는 값이 이어지는 첫 구간이다 (예: 점심 12~13시).
export function estimatePopularTimes(category, isWeekend = false) {
  const peaks = CATEGORY_PEAKS[category];
  if (!peaks) return null;
  const boost = isWeekend ? (WEEKEND_BOOST[category] ?? 1) : 1;

  const hours = POPULAR_HOURS.map((hour) => {
    const base = peaks
      .filter(([from, to]) => hour >= from && hour <= to)
      .reduce((max, [, , value]) => Math.max(max, value), BASE_LEVEL);
    const value = Math.min(100, Math.round(base * boost));
    return { hour, value, level: toLevel(value) };
  });

  const top = Math.max(...hours.map(({ value }) => value));
  const startIndex = hours.findIndex(({ value }) => value === top);
  let endIndex = startIndex;
  while (hours[endIndex + 1]?.value === top) endIndex += 1;
  return { hours, peak: { from: hours[startIndex].hour, to: hours[endIndex].hour + 1 } };
}
