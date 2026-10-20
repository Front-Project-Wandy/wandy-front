import { useQuery } from '@tanstack/react-query';
import { getPlace } from '../../../services/placeService';

// Place.id 하나로 장소 상세(10)를 불러온다.
export function usePlace(id) {
  return useQuery({
    queryKey: ['place', id],
    queryFn: () => getPlace(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    // 없는 장소는 다시 시도해도 없으니 바로 실패로 보여준다.
    retry: (count, error) => error.message !== 'PLACE_NOT_FOUND' && count < 2,
  });
}
