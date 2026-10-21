import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getProduct, getProducts } from '../../../services/productService';

const STALE_MS = 5 * 60 * 1000;

export function useProducts({ country = null, city = null, category = null } = {}) {
  return useQuery({
    queryKey: ['products', country, city, category],
    queryFn: () => getProducts({ country, city, category }),
    placeholderData: keepPreviousData,
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
