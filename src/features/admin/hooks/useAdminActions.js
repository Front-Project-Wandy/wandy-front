import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllProductsForAdmin } from '../../../services/productService';
import { useAdminStore } from './useAdminStore';

// 관리 화면의 상품 표 — 숨긴 상품도 보여야 해서 사용자 목록(['products'])과 키를 나눈다.
export function useAdminProducts() {
  return useQuery({ queryKey: ['admin', 'products'], queryFn: getAllProductsForAdmin });
}

// store 함수를 부른 뒤 상품 쿼리를 무효로 만든다. 사용자 목록·상세는 5분 캐시(staleTime)라
// 그냥 두면 숨긴 상품이 다른 화면에 남아 있다. 장소 숨김은 홈 추천이 store를 바로 읽어서 따로 할 일이 없다.
export function useAdminActions() {
  const queryClient = useQueryClient();
  // store 함수는 바뀌지 않아서, 값 변화로 다시 그리지 않도록 구독하지 않고 꺼내 쓴다.
  const store = useAdminStore.getState();

  const withRefresh =
    (action) =>
    (...args) => {
      action(...args);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    };

  return {
    toggleHidden: withRefresh(store.toggleHidden),
    togglePinned: withRefresh(store.togglePinned),
    movePinned: withRefresh(store.movePinned),
    reset: withRefresh(store.reset),
    toggleHiddenPlace: store.toggleHiddenPlace,
  };
}
