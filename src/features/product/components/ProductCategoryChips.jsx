import { useTranslation } from 'react-i18next';
import { PRODUCT_CATEGORIES } from '../constants';

const CHIP_VALUES = [null, ...PRODUCT_CATEGORIES];

// 상품 종류 필터. null = 전체.
export default function ProductCategoryChips({ value, onChange }) {
  const { t } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t('product.category.label')}
      className="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap"
    >
      {CHIP_VALUES.map((category) => {
        const selected = value === category;
        return (
          <button
            key={category ?? 'all'}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(category)}
            className={`h-11 shrink-0 rounded-full px-4 text-body-sm ${selected ? 'bg-brand font-bold text-text' : 'bg-bg-soft text-text'}`}
          >
            {t(`product.category.${category ?? 'all'}`)}
          </button>
        );
      })}
    </div>
  );
}
