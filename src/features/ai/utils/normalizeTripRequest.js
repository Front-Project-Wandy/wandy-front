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

// 플랜 계약상 동행이 'solo'면 인원은 1명이다. AI가 「혼자」만 알아듣고 인원을 비워 두면 1명으로 채우고,
// 인원을 2명 이상으로 분명히 말했으면 그 인원을 믿고 동행을 비운다 (공개 일정 가져오기와 같은 규칙).
// 그대로 두면 마법사에 「혼자」와 「2명」(기본 인원)이 같이 보이고, 저장할 때 동행이 조용히 빠진다.
const matchSoloPeople = (companion, people) => {
  if (companion !== 'solo') return { companion, people };
  if (people === null) return { companion, people: 1 };
  return people === 1 ? { companion, people } : { companion: null, people };
};

export function normalizeTripRequest(raw) {
  const city = Object.hasOwn(CITY_COUNTRY, raw?.city) ? raw.city : null;
  const country = city ? CITY_COUNTRY[city] : null;
  const categories = Array.isArray(raw?.categories) ? raw.categories : [];
  const { companion, people } = matchSoloPeople(
    COMPANIONS.includes(raw?.companion) ? raw.companion : null,
    toIntInRange(raw?.people, 1, MAX_PEOPLE),
  );

  return {
    country,
    city,
    // 장소 데이터가 있는 도시만 시작할 수 있다 (홈 인기 도시 카드와 같은 기준)
    isCityAvailable: Boolean(city) && (CITIES_BY_COUNTRY[country]?.includes(city) ?? false),
    days: toIntInRange(raw?.days, 1, MAX_TRIP_DAYS),
    people,
    style: TRAVEL_STYLES.includes(raw?.style) ? raw.style : null,
    preferredCategories: [...new Set(categories)].filter((category) =>
      PLACE_CATEGORIES.includes(category),
    ),
    companion,
  };
}
