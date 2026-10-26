import { TRAVEL_STYLES } from '../../member/constants';
import { CITIES_BY_COUNTRY, PLACE_CATEGORIES } from '../../search/place';

// 한 줄 요청 해석 결과 검증 (56). AI가 돌려준 값 중 우리가 쓰는 값만 남기고, 틀린 값은 null로 바꾼다.
// raw: { city, days, people, style, categories, companion } (buildMockTripRequest 또는 2단계 Gemini)
// → { country, city, isCityAvailable, days, people, style, preferredCategories, companion }

// 도시 → 나라. 홈 인기 도시(61)와 같은 여섯 곳이다.
const CITY_COUNTRY = {
  seoul: 'KR',
  busan: 'KR',
  jeju: 'KR',
  tokyo: 'JP',
  osaka: 'JP',
  fukuoka: 'JP',
};
// 마법사 STEP1 동행 값과 같다 (pages/Wizard/tripStyleOptions.js COMPANIONS)
const COMPANIONS = ['solo', 'couple', 'friends', 'family', 'kids'];
// 너무 긴 기간은 잘못 알아들은 것으로 본다
export const MAX_TRIP_DAYS = 14;
const MAX_PEOPLE = 20;

const toIntInRange = (value, min, max) =>
  Number.isInteger(value) && value >= min && value <= max ? value : null;

export function normalizeTripRequest(raw) {
  const city = Object.hasOwn(CITY_COUNTRY, raw?.city) ? raw.city : null;
  const country = city ? CITY_COUNTRY[city] : null;
  const categories = Array.isArray(raw?.categories) ? raw.categories : [];

  return {
    country,
    city,
    // 장소 데이터가 있는 도시만 시작할 수 있다 (홈 인기 도시 카드와 같은 기준)
    isCityAvailable: Boolean(city) && (CITIES_BY_COUNTRY[country]?.includes(city) ?? false),
    days: toIntInRange(raw?.days, 1, MAX_TRIP_DAYS),
    people: toIntInRange(raw?.people, 1, MAX_PEOPLE),
    style: TRAVEL_STYLES.includes(raw?.style) ? raw.style : null,
    preferredCategories: [...new Set(categories)].filter((category) =>
      PLACE_CATEGORIES.includes(category),
    ),
    companion: COMPANIONS.includes(raw?.companion) ? raw.companion : null,
  };
}
