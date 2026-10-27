import { getDistanceMeters } from '../../../features/search/utils/geo';

// 추천 숙소 위치 (75). 장소들까지 평균 직선거리가 가장 짧은 숙소 지역을 고른다.
// 가운데 지점(평균 좌표)과 가장 가까운 지역을 고르면 장소 하나가 멀리 떨어져 있을 때 엉뚱한 곳이 나와서,
// 지역마다 모든 장소까지의 평균 거리를 직접 비교한다. 지역은 도시마다 4~5곳이라 계산량은 작다.
// 돌려주는 값: { area, averageMeters } 또는 null (지역·장소가 없을 때)
export function recommendStayArea(areas, places) {
  const points = places.filter(
    (place) => Number.isFinite(place?.lat) && Number.isFinite(place?.lng),
  );
  if (areas.length === 0 || points.length === 0) return null;

  return areas
    .map((area) => ({
      area,
      averageMeters:
        points.reduce((sum, place) => sum + getDistanceMeters(area, place), 0) / points.length,
    }))
    .reduce((best, entry) => (!best || entry.averageMeters < best.averageMeters ? entry : best));
}

// 추천 기준 장소. 이미 담은 장소(한 줄로 AI 채우기, STEP5에서 되돌아온 경우)가 있으면 그 장소들,
// 없으면 이 도시 장소 중 이번 여행 선호 카테고리에 맞는 것, 선호 카테고리가 없거나 맞는 게 없으면 도시 전체.
// basis는 화면에서 "왜 이 지역인지" 문구를 고르는 데 쓴다.
export function pickRecommendBasis({ spotPlaces, cityPlaces, preferredCategories }) {
  if (spotPlaces.length > 0) return { basis: 'spots', places: spotPlaces };
  const preferred = cityPlaces.filter((place) => preferredCategories.includes(place.category));
  if (preferred.length > 0) return { basis: 'categories', places: preferred };
  return { basis: 'city', places: cityPlaces };
}
