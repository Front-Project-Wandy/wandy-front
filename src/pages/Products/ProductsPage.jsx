import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Loading from '../../components/common/Loading';
import ProductCard from '../../features/product/components/ProductCard';
import ProductCategoryChips from '../../features/product/components/ProductCategoryChips';
import ProductDetail from '../../features/product/components/ProductDetail';
import ProductPriceChips from '../../features/product/components/ProductPriceChips';
import { PRODUCT_CATEGORIES } from '../../features/product/constants';
import { useProducts } from '../../features/product/hooks/useProducts';
import { filterByPriceRange, PRICE_RANGE_KEYS } from '../../features/product/utils/priceRange';
import { COUNTRIES } from '../../features/search/place';
import CountryChips from './CountryChips';

// /products — 투어 상품 목록 (63). ?id= 가 있으면 상세 (64), ?country= ?category= ?price= 는 필터.
// 상세를 주소 파라미터로 둬서 App.jsx(공유 파일)에 경로를 따로 추가하지 않았다.
export default function ProductsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const id = params.get('id');
  const country = COUNTRIES.includes(params.get('country')) ? params.get('country') : null;
  const category = PRODUCT_CATEGORIES.includes(params.get('category'))
    ? params.get('category')
    : null;
  const priceRange = PRICE_RANGE_KEYS.includes(params.get('price')) ? params.get('price') : null;
  const { data, isPending, isError, isPlaceholderData, refetch } = useProducts({
    country,
    category,
  });
  // 가격대는 받은 목록에서 거른다 — 칩을 바꿀 때마다 다시 요청하지 않는다 (주변 식당 종류 필터와 같은 방식).
  const products = useMemo(() => filterByPriceRange(data ?? [], priceRange), [data, priceRange]);
  const hasFilter = Boolean(country || category || priceRange);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const updateParams = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    setParams(next);
  };

  // 목록에서 들어왔으면 뒤로, 주소로 바로 들어왔으면 목록으로.
  const handleBack = () => {
    if (window.history.state?.idx > 0) navigate(-1);
    else updateParams({ id: null });
  };

  if (id)
    return (
      <main className="mx-auto max-w-5xl space-y-4 px-4 py-4 lg:px-6 lg:py-6">
        <button
          type="button"
          onClick={handleBack}
          className="-ml-2 h-11 rounded-xl px-2 text-body-sm font-bold text-link"
        >
          <span aria-hidden="true">‹ </span>
          {t('common.action.back')}
        </button>
        <ProductDetail id={id} />
      </main>
    );

  const renderList = () => {
    if (isPending) return <Loading />;
    if (isError) return <ErrorState onRetry={() => refetch()} />;
    if (products.length === 0)
      return (
        <EmptyState
          title={t('product.empty.title')}
          description={t('product.empty.description')}
          action={
            hasFilter ? (
              <Button
                variant="secondary"
                onClick={() => updateParams({ country: null, category: null, price: null })}
              >
                {t('product.empty.clearFilters')}
              </Button>
            ) : null
          }
        />
      );
    return (
      <ul
        className={`grid gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${isPlaceholderData ? 'opacity-60' : ''}`}
      >
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} onSelect={(item) => updateParams({ id: item.id })} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <main className="mx-auto max-w-5xl space-y-4 px-4 py-6 lg:px-6">
      <header>
        <h1 className="text-title font-bold">{t('product.page.title')}</h1>
        <p className="mt-1 text-body-sm text-text/70">{t('product.page.description')}</p>
      </header>
      <CountryChips value={country} onChange={(next) => updateParams({ country: next })} />
      <ProductCategoryChips
        value={category}
        onChange={(next) => updateParams({ category: next })}
      />
      <ProductPriceChips value={priceRange} onChange={(next) => updateParams({ price: next })} />
      <p role="status" aria-live="polite" className="text-body-sm text-text/70">
        {t('product.list.count', { count: products.length })}
      </p>
      {renderList()}
    </main>
  );
}
