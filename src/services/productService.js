// 투어 상품 (G01, 62·63·64). 실제 예약 API는 쓰지 않는다 — 목업 목록 + 외부 예약 링크.
import productData from '../mocks/products.json';
import { mockRequest } from './api/mockRequest';

// 나라·도시·종류로 거른 상품 목록. 값이 없으면 그 조건은 보지 않는다.
export function getProducts({ country = null, city = null, category = null } = {}) {
  return mockRequest(() =>
    productData.products.filter(
      (product) =>
        (!country || product.country === country) &&
        (!city || product.city === city) &&
        (!category || product.category === category),
    ),
  );
}

export function getProduct(id) {
  return mockRequest(() => {
    const product = productData.products.find((item) => item.id === id);
    if (!product) throw new Error('PRODUCT_NOT_FOUND');
    return product;
  });
}
