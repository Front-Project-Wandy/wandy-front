import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Chip from '../../components/common/Chip';
import Input from '../../components/common/Input';
import { CITIES_BY_COUNTRY, COUNTRIES } from '../../features/search/place';
import { useWizardStore } from '../../store/wizard/wizardStore';
import { getTodayString, MAX_PEOPLE, validateTripStart } from './validateTripStart';

const CHIP_GROUP_CLASS = 'flex flex-col gap-2';
const LEGEND_CLASS = 'text-body-sm font-bold';

// 홈 "내 여행 만들기" 카드 (23). 나라·도시·날짜·인원을 받아 마법사로 넘긴다.
// 입력 중에는 이 컴포넌트 안(useState)에만 두고, [플래너 시작]을 눌러 검사를 통과하면 wizardStore에 저장한다.
export default function TripStartForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const startDraft = useWizardStore((state) => state.startDraft);

  const [country, setCountry] = useState(null);
  const [city, setCity] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [people, setPeople] = useState('2');
  const [errors, setErrors] = useState({});

  // 나라를 바꾸면 도시를 다시 고르게 한다. 도시가 하나뿐이면 바로 골라 준다 (지금은 서울·도쿄 하나씩).
  const handleCountryClick = (nextCountry) => {
    const cities = CITIES_BY_COUNTRY[nextCountry];
    setCountry(nextCountry);
    setCity(cities.length === 1 ? cities[0] : null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const values = { country, city, startDate, endDate, people };
    const nextErrors = validateTripStart(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    startDraft({ ...values, people: Number(people) });
    navigate('/plan/new');
  };

  const today = getTodayString();

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h2 className="text-subtitle font-bold">{t('home.start.title')}</h2>

      <fieldset className={CHIP_GROUP_CLASS}>
        <legend className={LEGEND_CLASS}>{t('home.start.country')}</legend>
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
        {errors.country && <p className="text-body-sm text-error">{t(errors.country)}</p>}
      </fieldset>

      {country && (
        <fieldset className={CHIP_GROUP_CLASS}>
          <legend className={LEGEND_CLASS}>{t('home.start.city')}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {CITIES_BY_COUNTRY[country].map((code) => (
              <Chip
                key={code}
                label={t(`common.city.${code}`)}
                selected={city === code}
                onClick={() => setCity(code)}
              />
            ))}
          </div>
          {errors.city && <p className="text-body-sm text-error">{t(errors.city)}</p>}
        </fieldset>
      )}

      {/* 날짜 칸은 달력 아이콘까지 있어서 좁은 폰에서 두 칸을 나란히 두면 글자가 잘린다. sm부터 나란히. */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          type="date"
          label={t('home.start.startDate')}
          value={startDate}
          min={today}
          onChange={(event) => setStartDate(event.target.value)}
        />
        <Input
          type="date"
          label={t('home.start.endDate')}
          value={endDate}
          min={startDate || today}
          onChange={(event) => setEndDate(event.target.value)}
        />
        {errors.dates && (
          <p className="-mt-1 text-body-sm sm:col-span-2 text-error">{t(errors.dates)}</p>
        )}
      </div>

      <Input
        type="number"
        inputMode="numeric"
        label={t('home.start.people')}
        value={people}
        min={1}
        max={MAX_PEOPLE}
        onChange={(event) => setPeople(event.target.value)}
        error={errors.people && t(errors.people, { max: MAX_PEOPLE })}
      />

      <Button type="submit" size="lg" className="w-full">
        {t('home.start.submit')}
      </Button>
    </form>
  );
}
