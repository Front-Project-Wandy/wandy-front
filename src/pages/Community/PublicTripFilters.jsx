import { useTranslation } from 'react-i18next';
import Chip from '../../components/common/Chip';
import { TRAVEL_STYLES } from '../Wizard/tripStyleOptions';
import { COMMUNITY_CITIES, TRIP_LENGTHS } from './publicTripUtils';

// 공개 일정 필터 (105). 줄마다 「전체」 + 선택지. 같은 칩을 다시 누르면 「전체」로 돌아간다.
// filters = { city, length, style }, onChange(name, value)
export default function PublicTripFilters({ filters, onChange }) {
  const { t } = useTranslation();
  const groups = [
    { name: 'city', options: COMMUNITY_CITIES, label: (key) => t(`common.city.${key}`) },
    { name: 'length', options: TRIP_LENGTHS, label: (key) => t(`community.filter.length.${key}`) },
    {
      name: 'style',
      options: TRAVEL_STYLES,
      label: (key) => t(`wizard.style.style.${key}.title`),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      {groups.map(({ name, options, label }) => (
        <div
          key={name}
          role="group"
          aria-label={t(`community.filter.group.${name}`)}
          className="flex flex-wrap items-center gap-2"
        >
          <span className="w-12 shrink-0 text-body-sm font-bold text-text/60">
            {t(`community.filter.group.${name}`)}
          </span>
          <Chip
            label={t('community.filter.all')}
            selected={!filters[name]}
            onClick={() => onChange(name, null)}
          />
          {options.map((option) => (
            <Chip
              key={option}
              label={label(option)}
              selected={filters[name] === option}
              onClick={() => onChange(name, filters[name] === option ? null : option)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
