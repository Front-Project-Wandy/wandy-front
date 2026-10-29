import { useQueries, useQuery } from '@tanstack/react-query';
import { pickThemePlaces } from '../../../pages/Home/curation/curationList';
import { getCityPlaces } from '../../../services/placeService';
import { placeQuery } from '../../search/hooks/usePlace';

const NO_IDS = [];

// 관리 화면 「추천 장소」 탭: 홈 추천(useCurationPlaces)과 같은 쿼리 키로 후보를 불러오되,
// 숨긴 장소도 다시 켤 수 있게 빼지 않고, 테마는 4곳으로 자르지 않고 맞는 장소를 모두 보여 준다.
export function useCurationCandidates(item) {
  const placeIds = item.placeIds ?? NO_IDS;
  const isTheme = placeIds.length === 0;

  const cityQuery = useQuery({
    queryKey: ['cityPlaces', item.country, item.city],
    queryFn: () => getCityPlaces({ country: item.country, city: item.city }),
    enabled: isTheme,
    staleTime: 5 * 60 * 1000,
  });
  const placeQueries = useQueries({ queries: placeIds.map((id) => placeQuery(id)) });

  if (isTheme)
    return {
      places: cityQuery.data ? pickThemePlaces(cityQuery.data, item.categories, [], Infinity) : [],
      isPending: cityQuery.isPending,
      isError: cityQuery.isError,
      refetch: cityQuery.refetch,
    };

  const places = placeQueries.map((query) => query.data).filter(Boolean);
  return {
    places,
    isPending: placeQueries.some((query) => query.isPending),
    isError: places.length === 0 && placeQueries.some((query) => query.isError),
    refetch: () => placeQueries.forEach((query) => query.refetch()),
  };
}
