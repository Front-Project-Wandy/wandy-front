import { useQueries } from '@tanstack/react-query';
import { placeQuery } from '../../../features/search/hooks/usePlace';

// 담은 장소 id들로 장소 정보를 다시 불러온다. 장소 상세·찜 목록과 같은 쿼리 키라 이미 본 장소는 다시 요청하지 않는다.
// 돌려주는 값: { [placeId]: { place, isPending, isError } }
export function useSpotPlaces(placeIds) {
  const results = useQueries({ queries: placeIds.map((id) => placeQuery(id)) });

  return Object.fromEntries(
    placeIds.map((id, index) => {
      const result = results[index];
      return [
        id,
        { place: result.data ?? null, isPending: result.isPending, isError: result.isError },
      ];
    }),
  );
}
