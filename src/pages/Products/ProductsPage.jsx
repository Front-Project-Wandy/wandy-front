import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Loading from '../../components/common/Loading';
import { useAdminStore } from '../../features/admin/hooks/useAdminStore';
import ProductCard from '../../features/product/components/ProductCard';
import ProductCategoryChips from '../../features/product/components/ProductCategoryChips';
import ProductDetail from '../../features/product/components/ProductDetail';
import ProductPriceChips from '../../features/product/components/ProductPriceChips';
import { PRODUCT_CATEGORIES, PRODUCT_PAGE_SIZE } from '../../features/product/constants';
import { useProducts } from '../../features/product/hooks/useProducts';
import { filterByPriceRange, PRICE_RANGE_KEYS } from '../../features/product/utils/priceRange';
import { rankProducts } from '../../features/product/utils/rankProducts';
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
  // 추천 고정 상품(85)은 「추천」 배지를 따로 달아서 순위에서 뺀다.
  const pinnedIds = useAdminStore((state) => state.pinnedProductIds);
  const ranks = useMemo(
    () => rankProducts(products.filter((product) => !pinnedIds.includes(product.id))),
    [products, pinnedIds],
  );
  const hasFilter = Boolean(country || category || priceRange);

  // [더보기]로 늘린 개수는 필터가 바뀌면 처음(한 쪽)으로 돌아간다.
  // 필터 값을 같이 들고 있다가 다르면 버리는 방식이라 effect로 따로 되돌리지 않아도 된다.
  const filterKey = `${country}|${category}|${priceRange}`;
  const [paging, setPaging] = useState({ key: filterKey, count: PRODUCT_PAGE_SIZE });
  const visibleCount = paging.key === filterKey ? paging.count : PRODUCT_PAGE_SIZE;
  const visibleProducts = products.slice(0, visibleCount);

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

  const handleMore = () => setPaging({ key: filterKey, count: visibleCount + PRODUCT_PAGE_SIZE });

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
      <>
        <ul
          key={`${filterKey}|${isPlaceholderData}`}
          className={`motion-results grid grid-cols-2 gap-x-3 gap-y-8 transition-opacity lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12 ${isPlaceholderData ? 'opacity-60' : 'motion-stagger'}`}
        >
          {visibleProducts.map((product) => (
            <li key={product.id} className="min-w-0">
              <ProductCard
                product={product}
                rank={ranks.get(product.id)}
                sizeClass="aspect-2/3 sm:aspect-3/4"
                onSelect={(item) => updateParams({ id: item.id })}
              />
            </li>
          ))}
        </ul>
        {visibleCount < products.length ? (
          <div className="mt-12 flex justify-center lg:mt-16">
            <button
              type="button"
              onClick={handleMore}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-text/20 bg-background px-8 text-body-sm font-bold transition-colors hover:bg-bg-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {t('product.list.more')}
              <span className="font-normal text-text/60">
                {t('product.list.progress', { shown: visibleCount, total: products.length })}
              </span>
              <span aria-hidden="true">↓</span>
            </button>
          </div>
        ) : null}
      </>
    );
  };

  // 칸 이름은 화면에 보이게 두고, 칩 묶음이 이미 같은 이름(aria-label)을 가져서 낭독기에는 숨긴다.
  const renderFilterRow = (label, chips) => (
    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <span aria-hidden="true" className="w-20 shrink-0 text-body-sm font-bold text-text/70">
        {label}
      </span>
      <div className="min-w-0">{chips}</div>
    </div>
  );

  return (
    <main className="mx-auto w-full max-w-360 px-4 pt-8 pb-16 lg:px-5 lg:pt-12 lg:pb-20">
      <header className="mb-8 lg:mb-12">
        <p className="mb-3 text-caption font-bold tracking-widest text-link">
          {t('product.page.eyebrow')}
        </p>
        <h1 className="text-title font-bold break-keep lg:text-display">
          {t('product.page.title')}
        </h1>
        <p className="mt-3 text-body-sm text-text/60 break-keep">{t('product.page.description')}</p>
      </header>
      <ProductCategoryChips
        variant="icon"
        value={category}
        onChange={(next) => updateParams({ category: next })}
      />
      <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-bg-soft p-4 sm:p-6">
        {renderFilterRow(
          t('product.country.label'),
          <CountryChips value={country} onChange={(next) => updateParams({ country: next })} />,
        )}
        {renderFilterRow(
          t('product.priceRange.label'),
          <ProductPriceChips
            value={priceRange}
            onChange={(next) => updateParams({ price: next })}
          />,
        )}
      </div>
      <p role="status" aria-live="polite" className="mt-8 mb-4 text-body-sm text-text/70">
        {t('product.list.count', { count: products.length })}
      </p>
      {renderList()}
    </main>
  );
}
