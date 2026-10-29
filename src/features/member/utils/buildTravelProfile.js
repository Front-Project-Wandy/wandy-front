import { PLACE_CATEGORIES } from '../../search/place';
import { TRAVEL_STYLES } from '../constants';

// 지난 여행처럼 프로필 (66). 저장한 여행에 담은 장소(myCategory)와 교통 방식으로 내 여행 취향을 계산한다.
// 숙소 타입은 플랜 trip.stay에 종류가 저장되지 않아서 계산하지 않는다.

// 비율을 보여 줄 카테고리 수. 프로필에 적용할 때도 이만큼만 넘긴다 (많으면 추천에서 앞으로 올리는 의미가 없다).
export const PROFILE_CATEGORY_LIMIT = 3;
// 하루 관광지 수(식사 제외) 기준. AI 일정 채우기 스타일 규칙(느긋 3·보통 4·빡빡 5곳)의 가운데 값으로 나눈다.
const DENSITY_LIMITS = { relaxed: 3.5, normal: 4.5 };
// 맛집과 카페 중 한쪽이 이 배수 이상이면 그쪽 위주로 본다.
const MEAL_LEAN_RATIO = 2;
const MEAL_CATEGORIES = new Set(['food', 'cafe']);

const countBy = (values) =>
  values.reduce((counts, value) => counts.set(value, (counts.get(value) ?? 0) + 1), new Map());

const toDensityStyle = (spotsPerDay) =>
  TRAVEL_STYLES.find((style) => spotsPerDay < (DENSITY_LIMITS[style] ?? Infinity));

const toMealStyle = (food, cafe) => {
  if (food === 0 && cafe === 0) return null;
  if (food >= cafe * MEAL_LEAN_RATIO) return 'food';
  if (cafe >= food * MEAL_LEAN_RATIO) return 'cafe';
  return 'balanced';
};

// trips: useAllTrips()의 여행 목록. 장소를 하나라도 담은 여행만 센다.
// → null(셀 여행 없음) 또는 { tripCount, placeCount, categories: [{ category, percent }],
//    density: { spotsPerDay, style }, transportMode | null, mealStyle: 'food' | 'cafe' | 'balanced' | null }
export function buildTravelProfile(trips) {
  const counted = trips.filter((trip) => (trip.days ?? []).some((day) => day.items.length > 0));
  if (counted.length === 0) return null;

  const days = counted.flatMap((trip) => trip.days).filter((day) => day.items.length > 0);
  const items = days.flatMap((day) => day.items);
  const categoryCounts = countBy(
    items.map((item) => item.myCategory).filter((category) => PLACE_CATEGORIES.includes(category)),
  );
  const categorized = [...categoryCounts.values()].reduce((sum, count) => sum + count, 0);
  // 개수가 같으면 PLACE_CATEGORIES 순서를 따른다 (sort는 같은 값의 순서를 그대로 둔다)
  const categories = PLACE_CATEGORIES.filter((category) => categoryCounts.has(category))
    .sort((a, b) => categoryCounts.get(b) - categoryCounts.get(a))
    .slice(0, PROFILE_CATEGORY_LIMIT)
    .map((category) => ({
      category,
      percent: Math.round((categoryCounts.get(category) / categorized) * 100),
    }));

  const spots = items.filter((item) => !MEAL_CATEGORIES.has(item.myCategory)).length;
  const spotsPerDay = Math.round((spots / days.length) * 10) / 10;

  // 교통 방식을 정한 여행 중 가장 많이 고른 것. 같으면 먼저 나온 여행(최근 여행이 앞) 것을 쓴다.
  const transportCounts = countBy(counted.map((trip) => trip.transportMode).filter(Boolean));
  const transportMode =
    [...transportCounts.entries()].reduce(
      (best, entry) => (!best || entry[1] > best[1] ? entry : best),
      null,
    )?.[0] ?? null;

  return {
    tripCount: counted.length,
    placeCount: items.length,
    categories,
    density: { spotsPerDay, style: toDensityStyle(spotsPerDay) },
    transportMode,
    mealStyle: toMealStyle(categoryCounts.get('food') ?? 0, categoryCounts.get('cafe') ?? 0),
  };
}
