import { useTranslation } from 'react-i18next';
import Chip from '../../../components/common/Chip';
import { getStayAreas } from './stayOptions';

// 숙소 지역 칩 (신주쿠·시부야… / 명동·홍대…). 직접 입력과 목업 검색이 같이 쓴다.
// 처음에는 아무것도 고르지 않는다.
export default function StayAreaChips({ city, value, onChange, legend, hint }) {
  const { t } = useTranslation();

  return (
    <fieldset>
      <legend className="text-body-sm font-bold">{legend}</legend>
      {hint && <p className="mt-1 text-caption text-text/70">{hint}</p>}
      <div className="mt-2 flex flex-wrap gap-2">
        {getStayAreas(city).map((area) => (
          <Chip
            key={area.key}
            label={t(`wizard.stay.area.${area.key}`)}
            selected={value === area.key}
            onClick={() => onChange(area)}
          />
        ))}
      </div>
    </fieldset>
  );
}
