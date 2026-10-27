import { useQuery } from '@tanstack/react-query';
import { getPlace } from '../../../services/placeService';

// Place.id 하나를 불러오는 쿼리 설정. 장소 상세와 찜 목록이 같은 키를 써서, 한쪽에서 본 장소는 다시 요청하지 않는다.
export const placeQuery = (id) => ({
  queryKey: ['place', id],
  queryFn: () => getPlace(id),
  enabled: Boolean(id),
  staleTime: 5 * 60 * 1000,
  // 없는 장소는 다시 시도해도 없으니 바로 실패로 보여준다.
  retry: (count, error) => error.message !== 'PLACE_NOT_FOUND' && count < 2,
});

// Place.id 하나로 장소 상세(10)를 불러온다.
export function usePlace(id) {
  return useQuery(placeQuery(id));
}
