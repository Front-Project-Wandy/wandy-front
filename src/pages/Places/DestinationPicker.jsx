import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import Chip from '../../components/common/Chip';
import { CITIES_BY_COUNTRY, COUNTRIES } from '../../features/search/place';

const LABEL_CLASS = 'w-10 shrink-0 text-body-sm font-bold text-text/70';

// 장소 탐색의 나라·도시 고르기. 검색이 나라·도시 단위라 둘 다 하나씩 꼭 골라야 해서 '전체'가 없다.
export default function DestinationPicker({ country, city, onChange }) {
  const { t } = useTranslation();
  const countryLabelId = useId();
  const cityLabelId = useId();

  // 나라를 바꾸면 그 나라의 첫 도시로 맞춘다 (지금은 나라마다 도시가 하나).
  const handleCountryClick = (nextCountry) =>
    onChange({ country: nextCountry, city: CITIES_BY_COUNTRY[nextCountry][0] });

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span id={countryLabelId} className={LABEL_CLASS}>
          {t('places.destination.country')}
        </span>
        <div role="group" aria-labelledby={countryLabelId} className="flex flex-wrap gap-2">
          {COUNTRIES.map((code) => (
            <Chip
              key={code}
              label={t(`common.country.${code}`)}
              selected={country === code}
              onClick={() => handleCountryClick(code)}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span id={cityLabelId} className={LABEL_CLASS}>
          {t('places.destination.city')}
        </span>
        <div role="group" aria-labelledby={cityLabelId} className="flex flex-wrap gap-2">
          {CITIES_BY_COUNTRY[country].map((code) => (
            <Chip
              key={code}
              label={t(`common.city.${code}`)}
              selected={city === code}
              onClick={() => onChange({ country, city: code })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
