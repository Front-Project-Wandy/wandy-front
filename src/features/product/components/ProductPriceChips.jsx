import { useTranslation } from 'react-i18next';
import Chip from '../../../components/common/Chip';
import { PRICE_RANGE_KEYS } from '../utils/priceRange';

const CHIP_VALUES = [null, ...PRICE_RANGE_KEYS];

// 상품 1인 가격대 필터 (73). null = 전체.
export default function ProductPriceChips({ value, onChange }) {
  const { t } = useTranslation();

  // 종류 칩과 같은 이유로 포커스 테두리 자리(p-1)를 두고 스크롤바를 숨긴다.
  return (
    <div
      role="group"
      aria-label={t('product.priceRange.label')}
      className="-mx-1 -mt-1 flex gap-2 overflow-x-auto p-1 [scrollbar-width:none] lg:flex-wrap"
    >
      {CHIP_VALUES.map((range) => (
        <Chip
          key={range ?? 'all'}
          label={t(`product.priceRange.${range ?? 'all'}`)}
          selected={value === range}
          onClick={() => onChange(range)}
        />
      ))}
    </div>
  );
}
