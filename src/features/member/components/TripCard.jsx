import { useTranslation } from 'react-i18next';
import { formatShortDate, getDaysUntil } from '../utils/tripDates';

// 내 여행 한 장 (36). 누르면 그 여행의 플래너로 간다.
// status는 MyTrips가 오늘 날짜로 구해서 넘긴다: 'upcoming' | 'ongoing' | 'past' | null(날짜 미정).
export default function TripCard({ trip, status, today, onSelect }) {
  const { t, i18n } = useTranslation();
  // 도시가 없으면 'common.city.null' 같은 키가 그대로 보이지 않게 따로 처리한다.
  const title =
    trip.title ||
    (trip.city
      ? t('my.trips.cityTrip', { city: t(`common.city.${trip.city}`) })
      : t('my.trips.untitled'));
  const dates = status
    ? `${formatShortDate(trip.startDate, i18n.language)} ~ ${formatShortDate(trip.endDate, i18n.language)}`
    : t('my.trips.noDates');

  const renderBadge = () => {
    if (status === 'upcoming')
      return (
        <span className="text-point">
          {t('my.trips.dday', { count: getDaysUntil(trip.startDate, today) })}
        </span>
      );
    if (status === 'ongoing') return <span className="text-link">{t('my.trips.ongoing')}</span>;
    return null;
  };
  const badge = renderBadge();

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(trip)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-text/10 bg-background p-4 text-left transition-colors hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <span className="min-w-0">
          <span className="block truncate text-body font-bold">{title}</span>
          <span className="block text-body-sm text-text/70">
            {dates} · {t('my.trips.people', { count: trip.people })}
          </span>
        </span>
        {badge ? (
          <span className="shrink-0 rounded-full bg-bg-soft px-3 py-1 text-body-sm font-bold">
            {badge}
          </span>
        ) : null}
      </button>
    </li>
  );
}
