// aiService — AI(Gemini) 호출 함수 (B파트). 화면은 이 파일의 함수만 부른다.
// 1단계: 규칙으로 만든 가짜 일정을 돌려준다. 2단계: 함수 안만 Spring Boot API 호출로 바꾼다 (Gemini 키는 서버에만).
import { buildMockItinerary } from '../features/ai/utils/buildMockItinerary';
import { buildMockPlaceDescription } from '../features/ai/utils/buildMockPlaceDescription';
import { buildMockTripRequest } from '../features/ai/utils/buildMockTripRequest';
import { buildMockTripTitles } from '../features/ai/utils/buildMockTripTitles';
import i18n from '../i18n';
import { mockRequest } from './api/mockRequest';
import { getCityPlaces } from './placeService';

// 빈 일정 자동 채우기 (55). 비어 있는 DAY에 넣을 장소를 Gemini 응답과 같은 모양으로 돌려준다.
// conditions: { country, city, style, preferredCategories, days: [{ date, itemCount }], excludePlaceIds,
//   likedPlaceIds, flight: { arriveAt, departAt } | null } — 도착일·출발일은 비행기 시간을 피해서 넣는다.
//   likedPlaceIds: 다녀와서 좋았다고 평가한 곳(97, 먼저 고름). 별로였던 곳은 excludePlaceIds에 들어 있다.
//   rainy: true면 비 오는 날 — 실내 장소를 먼저, 바깥 장소는 빼고 고른다 (79).
// → { days: [{ dayIndex, items: [{ name, startTime, stayMinutes }] }] } — 장소 이름만 있어서 validateItinerary로 확인해서 쓴다.
export async function fillItinerary(conditions) {
  const places = await getCityPlaces(conditions);
  return mockRequest(() => buildMockItinerary(conditions, places));
}

// 한 줄 요청 해석 (56). "2박3일 도쿄 먹방" → { city, days, people, style, categories, companion }
// 모르는 값은 null(카테고리는 빈 배열)이고, normalizeTripRequest로 확인해서 쓴다.
// 2단계: 서버가 Gemini에 문장을 넘겨 같은 모양의 JSON을 받는다 (Gemini 키는 서버에만).
export function parseTripRequest(text) {
  return mockRequest(() => buildMockTripRequest(text));
}

// 1단계 가짜 AI는 화면 언어의 번역 템플릿으로 문장을 만든다. 2단계에서는 언어(i18n.language)만 서버에 넘긴다.
const translate = (key, options) => i18n.t(key, options);

// 여행 제목 추천 (78). conditions: { city, days(일수), style, companion, preferredCategories }
// → { titles: ['도쿄 2박 3일 먹방 여행', '여유롭게 걷는 도쿄', ...] } (최대 3개, 한 개 40자 이하)
// 2단계: 서버가 Gemini에 조건과 언어를 넘겨 같은 모양의 JSON을 받는다 (Gemini 키는 서버에만).
export function suggestTripTitle(conditions) {
  return mockRequest(() => buildMockTripTitles(conditions, translate));
}

// 장소 한 줄 설명 (78). place: Place → { description: '도쿄 아사쿠사의 대표 관광 명소, 평점 4.5' }
// 2단계: 서버가 placeId로 장소를 다시 불러와 Gemini에 넘긴다 — 구글 장소 이름·주소를 우리 서버에 저장하지 않게.
export function describePlace(place) {
  return mockRequest(() => buildMockPlaceDescription(place, translate));
}
