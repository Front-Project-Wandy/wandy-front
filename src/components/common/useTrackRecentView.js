import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecentStore } from '../../store/recent/useRecentStore';

// '%'가 잘못 들어간 주소(/place/100%)는 decodeURIComponent가 에러를 던져서 앱 전체가 흰 화면이 된다.
// 기록은 덤 기능이라, 풀 수 없는 주소는 기록하지 않고 넘어간다 (화면은 장소 상세가 「없는 장소」로 보여 준다).
const safeDecode = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
};

// 주소를 보고 "무엇의 상세를 봤는지" 알아낸다. 장소 상세 /place/:id, 상품 상세 /products?id=...
export function getViewFromLocation({ pathname, search }) {
  const placeMatch = pathname.match(/^\/place\/([^/]+)$/);
  if (placeMatch) {
    const id = safeDecode(placeMatch[1]);
    return id ? { type: 'place', id } : null;
  }

  const productId = pathname === '/products' ? new URLSearchParams(search).get('id') : null;
  if (productId) return { type: 'product', id: productId };

  return null;
}

// 최근 본 장소·상품(83) 기록. 상세 화면(B파트)을 고치지 않으려고, 모든 화면을 감싸는 AppLayout에서
// 주소가 바뀔 때마다 상세 화면인지 보고 기록한다.
export function useTrackRecentView() {
  const location = useLocation();
  const add = useRecentStore((state) => state.add);

  useEffect(() => {
    const view = getViewFromLocation(location);
    if (view) add(view.type, view.id);
  }, [location, add]);
}
