import { useTranslation } from 'react-i18next';
import { getWeatherKind, isRainAlert, WEATHER_ICONS } from '../utils/weatherKind';

// 한 DAY의 날씨 한 칸 (58). 예보가 없는 날(예보 범위 밖)은 비어 있다고 알린다.
export default function WeatherDayCard({ number, forecast }) {
  const { t } = useTranslation();
  const kind = forecast ? getWeatherKind(forecast.code) : 'unknown';

  return (
    <li className="min-w-24 flex-1 rounded-2xl border border-text/10 p-3 text-body-sm">
      <p className="font-bold">{t('planner.day.title', { number })}</p>
      {forecast ? (
        <>
          <p>
            <span aria-hidden="true">{WEATHER_ICONS[kind]}</span>{' '}
            {t(`planner.weather.kind.${kind}`)}
          </p>
          {/* 값이 비어 오면 Math.round(null)이 0이라 0°로 보이니, 둘 다 있을 때만 보여 준다 */}
          {forecast.tempMax != null && forecast.tempMin != null ? (
            <p>
              {t('planner.weather.temp', {
                max: Math.round(forecast.tempMax),
                min: Math.round(forecast.tempMin),
              })}
            </p>
          ) : null}
          <p className="text-text/70">
            {t('planner.weather.rain', { percent: forecast.rainChance ?? 0 })}
          </p>
          {isRainAlert(forecast.rainChance) ? (
            <p className="mt-1 inline-block rounded-full bg-apricot-soft px-2 py-0.5 text-caption font-bold text-apricot-ink">
              {t('planner.weather.umbrella')}
            </p>
          ) : null}
        </>
      ) : (
        <p className="text-text/70">{t('planner.weather.noData')}</p>
      )}
    </li>
  );
}
