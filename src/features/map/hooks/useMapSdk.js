import { useQuery } from '@tanstack/react-query';
import { getMapKey, loadMapSdk } from '../utils/mapSdk';

// 지도 SDK 불러오는 상태: 'noKey' | 'loading' | 'error' | 'ready'
// SDK는 한 번 받으면 다시 받을 필요가 없어서 staleTime을 무한으로 둔다.
export function useMapSdk(provider) {
  const hasKey = Boolean(getMapKey(provider));
  const { isPending, isError, refetch } = useQuery({
    queryKey: ['map-sdk', provider],
    queryFn: () => loadMapSdk(provider),
    enabled: hasKey,
    staleTime: Infinity,
    retry: false,
  });

  if (!hasKey) return { status: 'noKey' };
  if (isPending) return { status: 'loading' };
  if (isError) return { status: 'error', retry: refetch };
  return { status: 'ready' };
}
