import { useQueries } from '@tanstack/react-query';
import { placeQuery } from '../../features/search/hooks/usePlace';
import { getProduct } from '../../services/productService';
import { useRecentStore } from '../../store/recent/useRecentStore';

// 상품 상세와 같은 쿼리 키(['product', id])라 이미 본 상품은 다시 요청하지 않는다.
const productQuery = (id) => ({
  queryKey: ['product', id],
  queryFn: () => getProduct(id),
  staleTime: 5 * 60 * 1000,
  retry: (count, error) => error.message !== 'PRODUCT_NOT_FOUND' && count < 2,
});

// 최근 본 기록(id만)을 장소·상품 내용으로 다시 불러온다.
// 없어진 장소·상품은 보여주지 않고 건너뛴다. 아직 불러오는 중인 항목은 isPending으로 알린다.
export function useRecentItems(limit) {
  const items = useRecentStore((state) => state.items).slice(0, limit);
  const results = useQueries({
    queries: items.map((item) =>
      item.type === 'place' ? placeQuery(item.id) : productQuery(item.id),
    ),
  });

  return {
    count: items.length,
    isPending: results.some((result) => result.isPending),
    entries: items
      .map((item, index) => ({ ...item, data: results[index].data }))
      .filter((entry) => entry.data),
  };
}
