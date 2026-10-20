import { useTranslation } from 'react-i18next';
import { PLACE_CATEGORIES } from '../place';

const CHIP_VALUES = [null, ...PLACE_CATEGORIES];

// 카테고리 필터 (8). null = 전체. 하나만 고를 수 있다.
export default function CategoryChips({ value, onChange }) {
  const { t } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t('search.category.label')}
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
            {category ? t(`common.category.${category}`) : t('search.category.all')}
          </button>
        );
      })}
    </div>
  );
}
