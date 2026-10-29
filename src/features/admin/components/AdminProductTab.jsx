import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyState from '../../../components/common/EmptyState';
import ErrorState from '../../../components/common/ErrorState';
import Loading from '../../../components/common/Loading';
import { ROW_COLUMN_CLASS } from '../constants';
import { useAdminActions, useAdminProducts } from '../hooks/useAdminActions';
import { useAdminStore } from '../hooks/useAdminStore';
import AdminPinnedPanel from './AdminPinnedPanel';
import AdminProductFilters from './AdminProductFilters';
import AdminProductRow from './AdminProductRow';

const NO_FILTERS = { country: null, city: null, category: null };

// 관리 화면 「투어 상품」 탭: 추천 고정 순서 + 필터 + 전체 상품 표(숨김·추천 고정 켜고 끄기).
export default function AdminProductTab() {
  const { t } = useTranslation();
  const { data, isPending, isError, refetch } = useAdminProducts();
  const hiddenIds = useAdminStore((state) => state.hiddenProductIds);
  const pinnedIds = useAdminStore((state) => state.pinnedProductIds);
  const { toggleHidden, togglePinned, movePinned } = useAdminActions();
  const [filters, setFilters] = useState(NO_FILTERS);

  if (isPending) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const products = data.filter(
    (product) =>
      (!filters.country || product.country === filters.country) &&
      (!filters.city || product.city === filters.city) &&
      (!filters.category || product.category === filters.category),
  );
  const header = (key, extra = '') => (
    <span className={`shrink-0 ${ROW_COLUMN_CLASS[key]} ${extra}`}>{t(`admin.table.${key}`)}</span>
  );

  return (
    <div className="flex flex-col gap-6">
      <AdminPinnedPanel
        pinnedIds={pinnedIds}
        products={data}
        onMove={movePinned}
        onUnpin={togglePinned}
      />
      <AdminProductFilters
        products={data}
        filters={filters}
        onChange={(patch) => setFilters((current) => ({ ...current, ...patch }))}
      />
      <p role="status" aria-live="polite" className="text-body-sm text-text/70">
        {t('admin.product.count', {
          count: products.length,
          hidden: products.filter((product) => hiddenIds.includes(product.id)).length,
        })}
      </p>
      {products.length === 0 ? (
        <EmptyState title={t('product.empty.title')} />
      ) : (
        <div className="lg:overflow-hidden lg:rounded-2xl lg:border lg:border-text/10 lg:bg-background">
          {/* 표 머리는 lg에서만 — 모바일 카드는 줄마다 값이 붙어 있어 머리가 필요 없다. */}
          <div
            aria-hidden="true"
            className="hidden gap-4 border-b border-text/10 bg-bg-soft px-4 py-2 text-caption font-bold text-text/70 lg:flex"
          >
            <span className="flex-1">{t('admin.table.title')}</span>
            {header('city')}
            {header('category')}
            {header('price', 'text-right')}
            {header('rating', 'text-right')}
            {header('actions', 'text-right')}
          </div>
          <ul className="flex flex-col gap-3 lg:gap-0 lg:divide-y lg:divide-text/10">
            {products.map((product) => (
              <AdminProductRow
                key={product.id}
                product={product}
                hidden={hiddenIds.includes(product.id)}
                pinned={pinnedIds.includes(product.id)}
                onToggleHidden={toggleHidden}
                onTogglePinned={togglePinned}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
