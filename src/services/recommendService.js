// 개인화 추천 (B파트). 화면은 이 파일의 함수만 부른다.
// 1단계: 사용자 데이터가 없어서 src/mocks/travelers.json(가상 여행자)으로 계산한다.
// 2단계: 함수 안만 Spring Boot API 호출로 바꾼다 — 서버가 실제 사용자 기록으로 같은 규칙(rankSimilarTravelerPlaces)을 쓴다.
import { rankSimilarTravelerPlaces } from '../features/search/utils/rankSimilarTravelerPlaces';
import travelers from '../mocks/travelers.json';
import { mockRequest } from './api/mockRequest';
import { getCityPlaces, withSamePlaceIds } from './placeService';

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
  // 담은 곳·좋았던 곳이 검색 결과(네이버)면 여행자 기록(장소 데이터 id)과 id가 달라서 같은 장소의 id까지 넓힌다.
  const [excluded, liked] = await Promise.all([
    withSamePlaceIds(excludePlaceIds, places),
    withSamePlaceIds(likedPlaceIds, places),
  ]);
  const placesById = new Map(places.map((place) => [place.id, place]));
  return mockRequest(() => {
    const result = rankSimilarTravelerPlaces({
      profile,
      travelers: travelers[city] ?? [],
      // 다른 도시에서 좋았던 곳은 이 도시 여행자와 겹칠 수 없어서, 넘기면 취향을 아는 것처럼 보이게만 한다
      likedPlaceIds: liked.filter((id) => placesById.has(id)),
      excludePlaceIds: excluded,
    });
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
