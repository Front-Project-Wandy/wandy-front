import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import Chip from '../../components/common/Chip';
import Input from '../../components/common/Input';
import { CITIES_BY_COUNTRY, COUNTRIES } from '../../features/search/place';
import { getTodayString, MAX_DATE, MAX_PEOPLE, MAX_TRIP_DAYS } from './validateBasicInfo';

const CHIP_GROUP_CLASS = 'flex flex-col gap-2';
const LEGEND_CLASS = 'text-body-sm font-bold';
const ERROR_CLASS = 'text-body-sm text-error';

// 나라·도시·날짜·인원 입력칸 묶음. 홈 "내 여행 만들기"와 마법사 STEP1이 같이 쓴다.
// 값을 직접 갖지 않고 values로 받아서, 바뀐 칸만 onChange({ 칸: 값 })로 알린다.
// 그래서 홈은 useState에, 마법사는 wizardStore에 그대로 연결할 수 있다.
export default function BasicInfoFields({ values, errors, onChange }) {
  const { t } = useTranslation();
  const { country, city, startDate, endDate, people } = values;

  // 에러 문구 id. 칸(fieldset·input)과 aria-describedby로 묶어서, 화면 낭독기가 칸에 들어갈 때 에러도 같이 읽게 한다.
  // 문구에는 role="alert"를 줘서 버튼을 누른 순간에도 바로 읽힌다.
  const errorIdPrefix = useId();
  const errorIds = {
    country: `${errorIdPrefix}-country`,
    city: `${errorIdPrefix}-city`,
    dates: `${errorIdPrefix}-dates`,
  };
  const describedBy = (field) => (errors[field] ? errorIds[field] : undefined);

  // 나라를 바꾸면 도시를 다시 고르게 한다. 도시가 하나뿐이면 바로 골라 준다 (지금은 서울·도쿄 하나씩).
  const handleCountryClick = (nextCountry) => {
    const cities = CITIES_BY_COUNTRY[nextCountry];
    onChange({ country: nextCountry, city: cities.length === 1 ? cities[0] : null });
  };

  const today = getTodayString();

  return (
    <>
      <fieldset className={CHIP_GROUP_CLASS} aria-describedby={describedBy('country')}>
        <legend className={LEGEND_CLASS}>{t('wizard.basic.country')}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {COUNTRIES.map((code) => (
            <Chip
              key={code}
              label={t(`common.country.${code}`)}
              selected={country === code}
              onClick={() => handleCountryClick(code)}
            />
          ))}
        </div>
        {errors.country && (
          <p id={errorIds.country} role="alert" className={ERROR_CLASS}>
            {t(errors.country)}
          </p>
        )}
      </fieldset>

      {country && (
        <fieldset className={CHIP_GROUP_CLASS} aria-describedby={describedBy('city')}>
          <legend className={LEGEND_CLASS}>{t('wizard.basic.city')}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {CITIES_BY_COUNTRY[country].map((code) => (
              <Chip
                key={code}
                label={t(`common.city.${code}`)}
                selected={city === code}
                onClick={() => onChange({ city: code })}
              />
            ))}
          </div>
          {errors.city && (
            <p id={errorIds.city} role="alert" className={ERROR_CLASS}>
              {t(errors.city)}
            </p>
          )}
        </fieldset>
      )}

      {/* 날짜 칸은 달력 아이콘까지 있어서 좁은 폰에서 두 칸을 나란히 두면 글자가 잘린다. sm부터 나란히. */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          type="date"
          label={t('wizard.basic.startDate')}
          value={startDate}
          min={today}
          max={MAX_DATE}
          onChange={(event) => onChange({ startDate: event.target.value })}
          aria-invalid={Boolean(errors.dates)}
          aria-describedby={describedBy('dates')}
        />
        <Input
          type="date"
          label={t('wizard.basic.endDate')}
          value={endDate}
          min={startDate || today}
          max={MAX_DATE}
          onChange={(event) => onChange({ endDate: event.target.value })}
          aria-invalid={Boolean(errors.dates)}
          aria-describedby={describedBy('dates')}
        />
        {errors.dates && (
          <p id={errorIds.dates} role="alert" className={`-mt-1 sm:col-span-2 ${ERROR_CLASS}`}>
            {t(errors.dates, { max: MAX_TRIP_DAYS })}
          </p>
        )}
      </div>

      <Input
        type="number"
        inputMode="numeric"
        label={t('wizard.basic.people')}
        value={people}
        min={1}
        max={MAX_PEOPLE}
        onChange={(event) => onChange({ people: event.target.value })}
        error={errors.people && t(errors.people, { max: MAX_PEOPLE })}
      />
    </>
  );
}
