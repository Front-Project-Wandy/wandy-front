import { useTranslation } from 'react-i18next';
import Chip from '../../../components/common/Chip';
import { PRODUCT_CATEGORIES } from '../constants';

const CHIP_VALUES = [null, ...PRODUCT_CATEGORIES];

// 상품 종류 필터. null = 전체.
export default function ProductCategoryChips({ value, onChange }) {
  const { t } = useTranslation();

  // 가로 스크롤 줄은 칩 바깥에 그려지는 포커스 테두리를 잘라 버린다.
  // 안쪽 여백(p-1)으로 테두리 자리를 두고, 음수 여백으로 칩 위치는 그대로 둔다.
  return (
    <div
      role="group"
      aria-label={t('product.category.label')}
      className="-mx-1 -mt-1 flex gap-2 overflow-x-auto p-1 lg:flex-wrap"
    >
      {CHIP_VALUES.map((category) => (
        <Chip
          key={category ?? 'all'}
          label={t(`product.category.${category ?? 'all'}`)}
          selected={value === category}
          onClick={() => onChange(category)}
        />
      ))}
    </div>
  );
}
