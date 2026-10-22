import { useTranslation } from 'react-i18next';
import Chip from '../../../components/common/Chip';
import { PLACE_CATEGORIES } from '../place';

const CHIP_VALUES = [null, ...PLACE_CATEGORIES];

// 카테고리 필터 (8). null = 전체. 하나만 고를 수 있다.
export default function CategoryChips({ value, onChange }) {
  const { t } = useTranslation();

  // 가로 스크롤 줄은 칩 바깥에 그려지는 포커스 테두리를 잘라 버린다.
  // 안쪽 여백(p-1)으로 테두리 자리를 두고, 음수 여백으로 칩 위치는 그대로 둔다.
  // 회색 스크롤바는 칩 아래를 가려서 숨긴다 (손가락·트랙패드로 밀면 되고, lg부터는 줄바꿈이라 스크롤이 없다).
  return (
    <div
      role="group"
      aria-label={t('search.category.label')}
      className="-mx-1 -mt-1 flex gap-2 overflow-x-auto p-1 [scrollbar-width:none] lg:flex-wrap"
    >
      {CHIP_VALUES.map((category) => (
        <Chip
          key={category ?? 'all'}
          label={category ? t(`common.category.${category}`) : t('search.category.all')}
          selected={value === category}
          onClick={() => onChange(category)}
        />
      ))}
    </div>
  );
}
