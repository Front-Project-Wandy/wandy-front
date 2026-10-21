import { useTranslation } from 'react-i18next';
import Chip from '../../../components/common/Chip';
import { FOOD_TYPES } from '../constants';

const CHIP_VALUES = [null, ...FOOD_TYPES];

// 음식 종류 필터 (44). null = 전체. 하나만 고를 수 있다.
export default function FoodTypeChips({ value, onChange }) {
  const { t } = useTranslation();

  // 가로 스크롤 줄은 칩 바깥에 그려지는 포커스 테두리를 잘라 버린다.
  // 안쪽 여백(p-1)으로 테두리 자리를 두고, 음수 여백으로 칩 위치는 그대로 둔다.
  return (
    <div
      role="group"
      aria-label={t('restaurant.foodType.label')}
      className="-mx-1 -mt-1 flex gap-2 overflow-x-auto p-1 lg:flex-wrap"
    >
      {CHIP_VALUES.map((foodType) => (
        <Chip
          key={foodType ?? 'all'}
          label={t(`restaurant.foodType.${foodType ?? 'all'}`)}
          selected={value === foodType}
          onClick={() => onChange(foodType)}
        />
      ))}
    </div>
  );
}
