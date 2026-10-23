// placeService — 화면은 이 파일의 함수만 부른다 (B파트 공유 계약).
// 나라별 차이(KR 네이버·TourAPI / JP Google Places)는 krPlaceService·jpPlaceService가 숨긴다.
// 1단계: src/mocks 더미를 돌려준다. 2단계: 함수 안만 Spring Boot API 호출로 바꾼다 (키는 서버에만).
import { getDistanceMeters } from '../features/search/utils/geo';
import { isSamePlace } from '../features/search/utils/samePlace';
import { mockRequest } from './api/mockRequest';
import { findJpPlace, listJpEatEntries, recommendJpPlaces, searchJpPlaces } from './jpPlaceService';
import { findKrPlace, listKrEatEntries, recommendKrPlaces, searchKrPlaces } from './krPlaceService';

export const NEARBY_RADIUS_M = 1000;

// 키워드·카테고리 검색 → Place[]
export function searchPlaces({ country, city, keyword = '', category = null }) {
  return mockRequest(() =>
    country === 'KR'
      ? searchKrPlaces({ city, keyword, category })
      : searchJpPlaces({ city, keyword, category }),
  );
}

// 도시별 추천 (KR TourAPI / JP 인기순) → Place[]
export function getRecommendedPlaces({ country, city, category = null }) {
  return mockRequest(() =>
    country === 'KR'
      ? recommendKrPlaces({ city, category })
      : recommendJpPlaces({ city, category }),
  );
}

// 도시의 장소 전체 (추천 + 검색 목록) → Place[]. AI 일정 채우기(55)의 후보이자 검증 기준이다.
// 한국은 TourAPI 추천과 네이버 검색에 같은 곳이 다른 id로 있을 수 있어서 같은 곳은 하나만 남긴다.
export function getCityPlaces({ country, city }) {
  return mockRequest(() => {
    const lists =
      country === 'KR'
        ? [recommendKrPlaces({ city }), searchKrPlaces({ city })]
        : [recommendJpPlaces({ city }), searchJpPlaces({ city })];
    return lists
      .flat()
      .reduce(
        (places, place) =>
          places.some((item) => isSamePlace(item, place)) ? places : [...places, place],
        [],
      );
  });
}

// Place.id로 장소 하나 → Place (없으면 PLACE_NOT_FOUND 에러)
export function getPlace(id) {
  return mockRequest(() => {
    const place = id.startsWith('google:') ? findJpPlace(id) : findKrPlace(id);
    if (!place) throw new Error('PLACE_NOT_FOUND');
    return place;
  });
}

// 기준 좌표 반경 안의 먹고 마시는 곳 → [{ place, distance, foodType }] 가까운 순 (distance 단위 m)
// foodType (44): 'korean' | 'ramen' | 'sushi' | 'cafe' | 'dessert' | 'bar' | 'other'
export function getNearbyRestaurants({ country, city, lat, lng, radius = NEARBY_RADIUS_M }) {
  return mockRequest(() => {
    const entries = country === 'KR' ? listKrEatEntries(city) : listJpEatEntries(city);
    return entries
      .map(({ place, foodType }) => ({
        place,
        foodType,
        distance: getDistanceMeters({ lat, lng }, place),
      }))
      .filter(({ distance }) => distance <= radius)
      .sort((a, b) => a.distance - b.distance);
  });
}
