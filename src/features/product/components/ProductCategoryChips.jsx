import { useTranslation } from 'react-i18next';
import Chip from '../../../components/common/Chip';
import { PRODUCT_CATEGORIES } from '../constants';
import ProductCategoryIcon from './ProductCategoryIcon';

// 고르지 않은 칸은 살구·연금빛을 번갈아 깔아, 하늘색(고른 칸) 하나만 반복되지 않게 한다 (분할보색 톤).
const WARM_TONES = ['bg-apricot-soft text-apricot-ink', 'bg-gold-soft text-gold-ink'];

const CHIP_VALUES = [null, ...PRODUCT_CATEGORIES];

// 상품 종류 필터. null = 전체.
// variant="icon": 상품 목록 위쪽의 둥근 아이콘 바로가기. 홈 섹션은 기본(칩)을 그대로 쓴다.
export default function ProductCategoryChips({ value, onChange, variant = 'chip' }) {
  const { t } = useTranslation();

  if (variant === 'icon')
    // 6개가 360px 한 줄에 들어가도록 칸을 똑같이 나누고, 원 크기는 sm부터 키운다.
    // 선택 표시는 Chip과 같은 규칙(brand 바탕 + 진한 ink 글자)이고 aria-pressed로 알린다.
    return (
      <div
        role="group"
        aria-label={t('product.category.label')}
        className="grid grid-cols-6 gap-1 sm:gap-4"
      >
        {CHIP_VALUES.map((category, index) => {
          const selected = value === category;
          return (
            <button
              key={category ?? 'all'}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(category)}
              className="group flex min-w-0 flex-col items-center gap-2 rounded-xl py-1 focus-visible:outline-2 focus-visible:outline-primary"
            >
              <span
                className={`grid size-12 place-items-center rounded-full transition-[transform,background-color] group-hover:-translate-y-0.5 sm:size-16 ${
                  selected ? 'bg-brand text-ink' : WARM_TONES[index % WARM_TONES.length]
                }`}
              >
                <ProductCategoryIcon category={category ?? 'all'} />
              </span>
              <span
                className={`text-caption break-keep sm:text-body-sm ${selected ? 'font-bold text-text' : 'text-text/70'}`}
              >
                {t(`product.category.${category ?? 'all'}`)}
              </span>
            </button>
          );
        })}
      </div>
    );

  // 가로 스크롤 줄은 칩 바깥에 그려지는 포커스 테두리를 잘라 버린다.
  // 안쪽 여백(p-1)으로 테두리 자리를 두고, 음수 여백으로 칩 위치는 그대로 둔다.
  // 회색 스크롤바는 칩 아래를 가려서 숨긴다 (손가락·트랙패드로 밀면 되고, lg부터는 줄바꿈이라 스크롤이 없다).
  return (
    <div
      role="group"
      aria-label={t('product.category.label')}
      className="-mx-1 -mt-1 flex gap-2 overflow-x-auto p-1 [scrollbar-width:none] lg:flex-wrap"
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
