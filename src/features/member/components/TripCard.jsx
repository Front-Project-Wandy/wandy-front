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

  // 날짜 미정 여행은 startDate가 없어서 D-day를 구하지 않도록 상태별로 나눠 만든다.
  const getBadge = () => {
    if (status === 'upcoming')
      return {
        label: t('my.trips.dday', { count: getDaysUntil(trip.startDate, today) }),
        className: 'text-apricot-ink',
      };
    if (status === 'ongoing') return { label: t('my.trips.ongoing'), className: 'text-link' };
    return null;
  };
  const badge = getBadge();

  return (
    <li className="min-w-0">
      <button
        type="button"
        onClick={() => onSelect(trip)}
        className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-text/10 bg-background text-left transition-colors hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {/* 여행에는 사진이 없어서 상품 카드처럼 옅은 바탕에 도시 이름을 크게 둔다. 지난 여행은 한 단계 흐리게. */}
        <span
          className={`relative flex aspect-3/1 min-h-32 w-full flex-col justify-end p-5 sm:aspect-5/2 ${status === 'past' ? 'bg-bg-soft' : 'bg-brand/15'}`}
        >
          {badge ? (
            <span
              className={`absolute top-4 left-4 rounded-full bg-background px-3 py-1 text-body-sm font-bold ${badge.className}`}
            >
              {badge.label}
            </span>
          ) : null}
          {trip.country ? (
            <span className="text-caption text-text/60">{t(`common.country.${trip.country}`)}</span>
          ) : null}
          {/* 도시를 아직 안 고른 여행은 아래 제목이 「이름 없는 여행」이라 같은 글자를 두 번 쓰지 않고 그림만 둔다. */}
          {trip.city ? (
            <span className="text-title font-bold break-keep">{t(`common.city.${trip.city}`)}</span>
          ) : (
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="text-primary"
            >
              <path d="M2 13.5 22 4l-5 16-4.5-6.5L2 13.5Zm10.5 0L22 4" />
            </svg>
          )}
        </span>
        <span className="flex flex-1 flex-col gap-1 p-5">
          <span className="block truncate text-body font-bold">{title}</span>
          <span className="block text-body-sm text-text/70">
            {dates} · {t('my.trips.people', { count: trip.people })}
          </span>
        </span>
      </button>
    </li>
  );
}
