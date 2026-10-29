// 개인화 추천 (B파트). 화면은 이 파일의 함수만 부른다.
// 1단계: 사용자 데이터가 없어서 src/mocks/travelers.json(가상 여행자)으로 계산한다.
// 2단계: 함수 안만 Spring Boot API 호출로 바꾼다 — 서버가 실제 사용자 기록으로 같은 규칙(rankSimilarTravelerPlaces)을 쓴다.
import { rankSimilarTravelerPlaces } from '../features/search/utils/rankSimilarTravelerPlaces';
import travelers from '../mocks/travelers.json';
import { mockRequest } from './api/mockRequest';
import { getCityPlaces } from './placeService';

// 비슷한 성향 여행자들이 많이 간 장소 (102).
// { country, city, profile, likedPlaceIds, excludePlaceIds }
// → { mode: 'similar' | 'popular', neighborCount, items: [{ place, visitedCount }] }
// 장소 데이터에서 찾지 못한 id는 뺀다 (장소 목록이 바뀌어도 화면이 깨지지 않게).
export async function getSimilarTravelerPlaces({
  country,
  city,
  profile,
  likedPlaceIds = [],
  excludePlaceIds = [],
}) {
  const places = await getCityPlaces({ country, city });
  return mockRequest(() => {
    const result = rankSimilarTravelerPlaces({
      profile,
      travelers: travelers[city] ?? [],
      likedPlaceIds,
      excludePlaceIds,
    });
    const placesById = new Map(places.map((place) => [place.id, place]));
    return {
      mode: result.mode,
      neighborCount: result.neighborCount,
      items: result.places
        .filter((entry) => placesById.has(entry.placeId))
        .map((entry) => ({
          place: placesById.get(entry.placeId),
          visitedCount: entry.visitedCount,
        })),
    };
  });
}
