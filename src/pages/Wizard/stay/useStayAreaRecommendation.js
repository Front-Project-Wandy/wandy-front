import { useQuery } from '@tanstack/react-query';
import { getCityPlaces } from '../../../services/placeService';
import { useSpotPlaces } from '../spots/useSpotPlaces';
import { pickRecommendBasis, recommendStayArea } from './recommendStayArea';
import { getStayAreas } from './stayOptions';

// STEP3 추천 숙소 지역 (75).
// → { recommendation: { area, averageMeters } | null, basis, placeCount, isPending, isError, refetch }
// 담은 장소는 다시 불러오고(장소 상세와 같은 캐시), 도시 장소 목록도 같이 불러온다.
// 담은 장소를 하나도 못 불러오면 도시 목록으로 추천하려고 도시 목록은 항상 불러온다 (목업이라 가볍다).
// 도시 목록 쿼리 키는 홈 테마 추천(81)과 같게 맞춰 캐시를 같이 쓴다.
export function useStayAreaRecommendation({ country, city, spotPlaceIds, preferredCategories }) {
  const spotEntries = Object.values(useSpotPlaces(spotPlaceIds));
  const cityQuery = useQuery({
    queryKey: ['cityPlaces', country, city],
    queryFn: () => getCityPlaces({ country, city }),
    staleTime: 5 * 60 * 1000,
  });

  const isPending = cityQuery.isPending || spotEntries.some((entry) => entry.isPending);
  const spotPlaces = spotEntries.map((entry) => entry.place).filter(Boolean);
  const isError = cityQuery.isError && spotPlaces.length === 0;
  if (isPending || isError) {
    return { recommendation: null, basis: null, isPending, isError, refetch: cityQuery.refetch };
  }

  const { basis, places } = pickRecommendBasis({
    spotPlaces,
    cityPlaces: cityQuery.data ?? [],
    preferredCategories,
  });
  return {
    recommendation: recommendStayArea(getStayAreas(city), places),
    basis,
    placeCount: places.length,
    isPending: false,
    isError: false,
    refetch: cityQuery.refetch,
  };
}
