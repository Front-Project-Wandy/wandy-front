import { useTranslation } from 'react-i18next';
import Chip from '../../../components/common/Chip';
import { PLACE_CATEGORIES } from '../place';
import CategoryIcon from './CategoryIcon';

// 고르지 않은 칸은 살구·연금빛을 번갈아 깔아, 하늘색(고른 칸) 하나만 반복되지 않게 한다 (분할보색 톤).
const WARM_TONES = ['bg-apricot-soft text-apricot-ink', 'bg-gold-soft text-gold-ink'];

const CHIP_VALUES = [null, ...PLACE_CATEGORIES];

// 카테고리 필터 (8). null = 전체. 하나만 고를 수 있다.
// variant="icon"은 장소 탐색(/places)의 둥근 아이콘 바로가기 모양이다. 마법사·일정 추가 모달은 기본 칩을 그대로 쓴다.
export default function CategoryChips({ value, onChange, variant = 'chip' }) {
  const { t } = useTranslation();
  const getLabel = (category) =>
    category ? t(`common.category.${category}`) : t('search.category.all');

  // 가로 스크롤 줄은 칩 바깥에 그려지는 포커스 테두리를 잘라 버린다.
  // 안쪽 여백(p-1)으로 테두리 자리를 두고, 음수 여백으로 칩 위치는 그대로 둔다.
  // 회색 스크롤바는 칩 아래를 가려서 숨긴다 (손가락·트랙패드로 밀면 되고, lg부터는 줄바꿈이라 스크롤이 없다).
  if (variant === 'icon')
    return (
      <div
        role="group"
        aria-label={t('search.category.label')}
        className="-mx-4 flex gap-1 overflow-x-auto px-3 py-1 [scrollbar-width:none] sm:mx-0 sm:justify-between sm:px-0"
      >
        {CHIP_VALUES.map((category, index) => {
          const selected = value === category;
          return (
            <button
              key={category ?? 'all'}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(category)}
              className="group flex w-18 shrink-0 flex-col items-center gap-2 rounded-xl py-1 focus-visible:outline-2 focus-visible:outline-primary sm:w-20"
            >
              {/* brand 위에는 흰 글자를 쓰지 않는 규칙이라 고른 칸의 아이콘은 테마와 상관없이 진한 ink다. */}
              <span
                className={`grid size-14 place-items-center rounded-full transition-colors sm:size-16 ${
                  selected
                    ? 'bg-brand text-ink'
                    : `${WARM_TONES[index % WARM_TONES.length]} group-hover:bg-brand/20`
                }`}
              >
                <CategoryIcon category={category} size={26} />
              </span>
              <span className={`text-body-sm ${selected ? 'font-bold text-text' : 'text-text/70'}`}>
                {getLabel(category)}
              </span>
            </button>
          );
        })}
      </div>
    );

  return (
    <div
      role="group"
      aria-label={t('search.category.label')}
      className="-mx-1 -mt-1 flex gap-2 overflow-x-auto p-1 [scrollbar-width:none] lg:flex-wrap"
    >
      {CHIP_VALUES.map((category) => (
        <Chip
          key={category ?? 'all'}
          label={getLabel(category)}
          selected={value === category}
          onClick={() => onChange(category)}
        />
      ))}
    </div>
  );
}
