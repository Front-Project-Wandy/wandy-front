import { useQueries, useQuery } from '@tanstack/react-query';
import { placeQuery } from '../../../features/search/hooks/usePlace';
import { getCityPlaces } from '../../../services/placeService';
import { CURATION_PLACE_LIMIT, pickThemePlaces } from './curationList';

const NO_IDS = [];

// 고른 칩(시즌·테마)의 장소를 불러온다. → { places, isPending, isError, refetch }
// 시즌은 정해 둔 placeIds를 하나씩(장소 상세와 같은 캐시), 테마는 도시 장소 전체를 불러와 카테고리로 거른다.
// 훅은 조건에 따라 부르거나 빼면 안 돼서, 둘 다 부르고 쓰지 않는 쪽은 enabled·빈 목록으로 쉬게 한다.
// 없어진 장소 id는 건너뛴다 (최근 본 기록과 같은 방식).
export function useCurationPlaces(item) {
  const placeIds = item.placeIds ?? NO_IDS;
  const isTheme = placeIds.length === 0;

  const cityQuery = useQuery({
    queryKey: ['cityPlaces', item.country, item.city],
    queryFn: () => getCityPlaces({ country: item.country, city: item.city }),
    enabled: isTheme,
    staleTime: 5 * 60 * 1000,
  });
  const placeQueries = useQueries({ queries: placeIds.map((id) => placeQuery(id)) });

  if (isTheme) {
    return {
      places: cityQuery.data ? pickThemePlaces(cityQuery.data, item.categories) : [],
      isPending: cityQuery.isPending,
      isError: cityQuery.isError,
      refetch: cityQuery.refetch,
    };
  }

  const places = placeQueries
    .map((query) => query.data)
    .filter(Boolean)
    .slice(0, CURATION_PLACE_LIMIT);
  return {
    places,
    isPending: placeQueries.some((query) => query.isPending),
    // 일부만 실패하면 남은 장소를 보여 주고, 전부 실패했을 때만 에러로 본다.
    isError: places.length === 0 && placeQueries.some((query) => query.isError),
    refetch: () => placeQueries.forEach((query) => query.refetch()),
  };
}
