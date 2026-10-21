import { useTranslation } from 'react-i18next';
import { FOOD_TYPES } from '../constants';

const CHIP_VALUES = [null, ...FOOD_TYPES];

// 음식 종류 필터 (44). null = 전체. 하나만 고를 수 있다.
export default function FoodTypeChips({ value, onChange }) {
  const { t } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t('restaurant.foodType.label')}
      className="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap"
    >
      {CHIP_VALUES.map((foodType) => {
        const selected = value === foodType;
        return (
          <button
            key={foodType ?? 'all'}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(foodType)}
            className={`h-11 shrink-0 rounded-full px-4 text-body-sm ${selected ? 'bg-brand font-bold text-text' : 'bg-bg-soft text-text'}`}
          >
            {t(`restaurant.foodType.${foodType ?? 'all'}`)}
          </button>
        );
      })}
    </div>
  );
}
