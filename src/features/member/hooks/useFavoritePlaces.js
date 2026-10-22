import { useQueries } from '@tanstack/react-query';
import { placeQuery } from '../../search/hooks/usePlace';
import { useFavoriteStore } from './useFavoriteStore';

// 찜한 id들로 장소를 불러온다 (37). 장소 상세와 같은 쿼리 키라 이미 본 장소는 다시 요청하지 않는다.
export function useFavoritePlaces() {
  const ids = useFavoriteStore((state) => state.ids);
  const results = useQueries({ queries: ids.map((id) => placeQuery(id)) });

  // 없어진 장소(PLACE_NOT_FOUND)는 에러로 보여 주지 않고 목록에서만 뺀다.
  const failed = results.filter(
    (result) => result.isError && result.error.message !== 'PLACE_NOT_FOUND',
  );

  return {
    ids,
    places: results.filter((result) => result.data).map((result) => result.data),
    isPending: results.some((result) => result.isPending),
    isError: failed.length > 0,
    refetch: () => failed.forEach((result) => result.refetch()),
  };
}
