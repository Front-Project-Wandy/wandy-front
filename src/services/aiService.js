// aiService — AI(Gemini) 호출 함수 (B파트). 화면은 이 파일의 함수만 부른다.
// 1단계: 규칙으로 만든 가짜 일정을 돌려준다. 2단계: 함수 안만 Spring Boot API 호출로 바꾼다 (Gemini 키는 서버에만).
import { buildMockItinerary } from '../features/ai/utils/buildMockItinerary';
import { mockRequest } from './api/mockRequest';
import { getCityPlaces } from './placeService';

// 빈 일정 자동 채우기 (55). 비어 있는 DAY에 넣을 장소를 Gemini 응답과 같은 모양으로 돌려준다.
// conditions: { country, city, style, preferredCategories, days: [{ itemCount }], excludePlaceIds }
// → { days: [{ dayIndex, items: [{ name, startTime, stayMinutes }] }] } — 장소 이름만 있어서 validateItinerary로 확인해서 쓴다.
export async function fillItinerary(conditions) {
  const places = await getCityPlaces(conditions);
  return mockRequest(() => buildMockItinerary(conditions, places));
}
