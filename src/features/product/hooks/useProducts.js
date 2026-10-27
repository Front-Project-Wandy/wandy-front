import { useQuery } from '@tanstack/react-query';
import { getProduct, getProducts } from '../../../services/productService';

const STALE_MS = 5 * 60 * 1000;

export function useProducts({ country = null, city = null, category = null } = {}) {
  // 장소 검색(usePlaceSearch)과 같은 기준: 같은 나라·도시에서 종류만 바뀔 때는 이전 목록을 남겨 깜빡임을 막고,
  // 나라·도시가 바뀌면 다른 나라 상품을 누를 수 없도록 이전 목록을 버리고 로딩으로 보낸다.
  const keepSameDestinationData = (previousData, previousQuery) => {
    const [, previousCountry, previousCity] = previousQuery?.queryKey ?? [];
    return previousCountry === country && previousCity === city ? previousData : undefined;
  };

  return useQuery({
    queryKey: ['products', country, city, category],
    queryFn: () => getProducts({ country, city, category }),
    placeholderData: keepSameDestinationData,
    staleTime: STALE_MS,
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    enabled: Boolean(id),
    staleTime: STALE_MS,
    retry: (count, error) => error.message !== 'PRODUCT_NOT_FOUND' && count < 2,
  });
}
