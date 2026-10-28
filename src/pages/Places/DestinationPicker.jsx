import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { CITIES_BY_COUNTRY, COUNTRIES } from '../../features/search/place';

const LABEL_CLASS = 'text-caption font-bold text-text/60';
// 흰 글자는 primary 위 16px 굵게만 쓰는 규칙이라 고른 칸은 text-body font-bold로 둔다.
const OPTION_CLASS =
  'h-10 rounded-full px-5 text-body font-bold transition-colors focus-visible:outline-2 focus-visible:outline-primary';

// 장소 탐색의 나라·도시 고르기. 검색이 나라·도시 단위라 둘 다 하나씩 꼭 골라야 해서 '전체'가 없다.
// 히어로 안에 놓여서 홈 히어로의 도시 고르기와 같은 알약 모양 묶음으로 그린다.
export default function DestinationPicker({ country, city, onChange }) {
  const { t } = useTranslation();
  const countryLabelId = useId();
  const cityLabelId = useId();

  // 나라를 바꾸면 그 나라의 첫 도시로 맞춘다 (지금은 나라마다 도시가 하나).
  const handleCountryClick = (nextCountry) =>
    onChange({ country: nextCountry, city: CITIES_BY_COUNTRY[nextCountry][0] });

  const renderGroup = ({ labelId, label, options, selected, onSelect, getLabel }) => (
    <div className="flex items-center gap-3">
      <span id={labelId} className={LABEL_CLASS}>
        {label}
      </span>
      <div
        role="group"
        aria-labelledby={labelId}
        className="flex flex-wrap rounded-full border border-text/10 bg-background p-1"
      >
        {options.map((code) => (
          <button
            key={code}
            type="button"
            aria-pressed={selected === code}
            onClick={() => onSelect(code)}
            className={`${OPTION_CLASS} ${selected === code ? 'bg-primary text-white' : 'text-text/70 hover:bg-bg-soft'}`}
          >
            {getLabel(code)}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      {renderGroup({
        labelId: countryLabelId,
        label: t('places.destination.country'),
        options: COUNTRIES,
        selected: country,
        onSelect: handleCountryClick,
        getLabel: (code) => t(`common.country.${code}`),
      })}
      {renderGroup({
        labelId: cityLabelId,
        label: t('places.destination.city'),
        options: CITIES_BY_COUNTRY[country],
        selected: city,
        onSelect: (code) => onChange({ country, city: code }),
        getLabel: (code) => t(`common.city.${code}`),
      })}
    </div>
  );
}
