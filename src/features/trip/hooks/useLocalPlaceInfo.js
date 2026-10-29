import { useQuery } from '@tanstack/react-query';
import { getLocalPlaceInfo } from '../../../services/localPlaceService';

// 장소의 현지어 이름·주소 (요구사항 #94). 창이 열렸을 때만 불러온다.
export function useLocalPlaceInfo(placeId, enabled) {
  return useQuery({
    queryKey: ['localPlaceInfo', placeId],
    queryFn: () => getLocalPlaceInfo(placeId),
    enabled: enabled && Boolean(placeId),
    staleTime: 5 * 60 * 1000,
    // 없는 장소는 다시 시도해도 없으니 바로 실패로 보여 준다
    retry: (count, error) => error.message !== 'LOCAL_INFO_NOT_FOUND' && count < 2,
  });
}
