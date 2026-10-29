import { useTranslation } from 'react-i18next';
import ErrorState from '../../../components/common/ErrorState';
import Loading from '../../../components/common/Loading';
import { useTripWeather } from '../hooks/useTripWeather';
import { formatDayDate } from '../utils/formatDay';
import WeatherDayCard from './WeatherDayCard';

// 플래너 위쪽의 DAY별 날씨 줄 (58). 예보는 오늘부터 16일 뒤까지만 있어서, 먼 여행은 언제부터 보이는지 안내만 한다.
export default function TripWeather({ trip }) {
  const { t, i18n } = useTranslation();
  const { range, forecastByDate, isLoading, isError, refetch } = useTripWeather(trip);

  if (range.status === 'none' || range.status === 'past') return null;

  const renderBody = () => {
    if (range.status === 'tooFar') {
      return (
        <p className="text-body-sm text-text/70">
          {t('planner.weather.tooFar', { date: formatDayDate(range.availableFrom, i18n.language) })}
        </p>
      );
    }
    if (isLoading) return <Loading text={t('planner.weather.loading')} className="py-4" />;
    if (isError) {
      return <ErrorState message={t('planner.weather.error')} onRetry={refetch} className="py-4" />;
    }
    return (
      <ul className="flex flex-wrap gap-2">
        {trip.days.map((day, index) => (
          <WeatherDayCard
            key={day.date}
            number={index + 1}
            forecast={forecastByDate?.get(day.date)}
          />
        ))}
      </ul>
    );
  };

  return (
    <section aria-label={t('planner.weather.title')} className="space-y-2">
      {renderBody()}
      <p className="text-caption text-text/70">
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-link underline"
        >
          {t('planner.weather.credit')}
        </a>
      </p>
    </section>
  );
}
