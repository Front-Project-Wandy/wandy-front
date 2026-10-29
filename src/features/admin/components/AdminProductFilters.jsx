import { useTranslation } from 'react-i18next';
import Chip from '../../../components/common/Chip';
import CountryChips from '../../../pages/Products/CountryChips';
import ProductCategoryChips from '../../product/components/ProductCategoryChips';

// 관리 화면 상품 필터 (나라·도시·종류). 나라·종류 칩은 상품 목록(63)과 같은 것을 쓴다.
// 도시는 정해진 목록 대신 상품이 있는 도시만 칩으로 만든다 — 상품이 없는 도시를 골라 빈 표가 나오지 않게.
export default function AdminProductFilters({ products, filters, onChange }) {
  const { t } = useTranslation();
  const cities = [
    ...new Set(
      products
        .filter((product) => !filters.country || product.country === filters.country)
        .map((product) => product.city),
    ),
  ];

  const renderRow = (label, chips) => (
    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <span aria-hidden="true" className="w-20 shrink-0 text-body-sm font-bold text-text/70">
        {label}
      </span>
      <div className="min-w-0">{chips}</div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-bg-soft p-4 sm:p-6">
      {/* 나라를 바꾸면 다른 나라 도시가 골라진 채 남지 않게 도시를 비운다. */}
      {renderRow(
        t('product.country.label'),
        <CountryChips
          value={filters.country}
          onChange={(country) => onChange({ country, city: null })}
        />,
      )}
      {renderRow(
        t('admin.filter.city'),
        <div role="group" aria-label={t('admin.filter.city')} className="flex flex-wrap gap-2">
          {[null, ...cities].map((city) => (
            <Chip
              key={city ?? 'all'}
              label={city ? t(`common.city.${city}`) : t('product.country.all')}
              selected={filters.city === city}
              onClick={() => onChange({ city })}
            />
          ))}
        </div>,
      )}
      {renderRow(
        t('product.category.label'),
        <ProductCategoryChips
          value={filters.category}
          onChange={(category) => onChange({ category })}
        />,
      )}
    </div>
  );
}
