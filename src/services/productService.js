// 투어 상품 (G01, 62·63·64). 실제 예약 API는 쓰지 않는다 — 목업 목록 + 외부 예약 링크.
import { useAdminStore } from '../features/admin/hooks/useAdminStore';
import productData from '../mocks/products.json';
import { mockRequest } from './api/mockRequest';

// 관리자 설정(85)을 사용자 목록에 적용한다: 숨긴 상품은 빼고, 추천 고정 상품을 고정 순서대로 맨 앞에.
// 서비스는 훅이 아니라서 getState()로 읽는다. 2단계에서는 서버가 거른 목록을 주므로 이 함수를 지운다.
function applyAdminSettings(products) {
  const { hiddenProductIds, pinnedProductIds } = useAdminStore.getState();
  const visible = products.filter((product) => !hiddenProductIds.includes(product.id));
  const pinned = pinnedProductIds
    .map((id) => visible.find((product) => product.id === id))
    .filter(Boolean);
  return [...pinned, ...visible.filter((product) => !pinnedProductIds.includes(product.id))];
}

const isHidden = (id) => useAdminStore.getState().hiddenProductIds.includes(id);

// 나라·도시·종류로 거른 상품 목록. 값이 없으면 그 조건은 보지 않는다.
export function getProducts({ country = null, city = null, category = null } = {}) {
  return mockRequest(() =>
    applyAdminSettings(
      productData.products.filter(
        (product) =>
          (!country || product.country === country) &&
          (!city || product.city === city) &&
          (!category || product.category === category),
      ),
    ),
  );
}

// 숨긴 상품은 사용자에게 없는 상품과 같다 (최근 본 기록·주소로 바로 들어와도 보이지 않게).
export function getProduct(id) {
  return mockRequest(() => {
    const product = productData.products.find((item) => item.id === id);
    if (!product || isHidden(id)) throw new Error('PRODUCT_NOT_FOUND');
    return product;
  });
}

// 관리 화면(85) 전용: 숨김·고정과 상관없이 원래 순서의 전체 목록.
export function getAllProductsForAdmin() {
  return mockRequest(() => productData.products);
}
