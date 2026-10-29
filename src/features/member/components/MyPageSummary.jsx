import { useTranslation } from 'react-i18next';
import { useAllTrips } from '../../../store/plan/useAllTrips';
import { useFavoriteStore } from '../hooks/useFavoriteStore';
import { usePlaceRatingStore } from '../hooks/usePlaceRatingStore';
import { groupMyTrips } from '../utils/groupMyTrips';
import { getDaysUntil, getLocalDateString } from '../utils/tripDates';

// 마이페이지 맨 위 인사·요약 카드. 숫자를 누르면 아래 그 섹션으로 내려간다 (MyPage의 앵커 id).
// 로그인이 아직 없어서 이름 대신 「여행자님」으로 부르고, 숫자는 모두 이 기기에 저장된 값으로 센다.
export default function MyPageSummary({ anchors }) {
  const { t } = useTranslation();
  const trips = useAllTrips();
  const favoriteCount = useFavoriteStore((state) => state.ids.length);
  const ratingCount = usePlaceRatingStore((state) => Object.keys(state.ratings).length);
  const today = getLocalDateString();
  const { upcoming, past } = groupMyTrips(trips, today);

  // 예정 목록은 진행 중 → 가까운 출발일 순이라 첫 여행이 곧 「다음 여행」이다.
  const next = upcoming[0];
  const nextTitle =
    next &&
    (next.trip.title ||
      (next.trip.city
        ? t('my.trips.cityTrip', { city: t(`common.city.${next.trip.city}`) })
        : t('my.trips.untitled')));
  const renderNext = () => {
    if (next?.status === 'ongoing') return t('my.page.ongoing', { title: nextTitle });
    if (next?.status === 'upcoming')
      return t('my.page.nextTrip', {
        title: nextTitle,
        count: getDaysUntil(next.trip.startDate, today),
      });
    return t('my.page.description');
  };

  const stats = [
    { key: 'upcoming', count: upcoming.length, unit: 'tripCount', href: anchors.trips },
    { key: 'past', count: past.length, unit: 'tripCount', href: anchors.trips },
    { key: 'favorites', count: favoriteCount, unit: 'placeCount', href: anchors.favorites },
    { key: 'ratings', count: ratingCount, unit: 'placeCount', href: anchors.ratings },
  ];

  return (
    <header className="rounded-2xl bg-bg-soft p-6 sm:p-10">
      <h1 className="text-caption font-bold tracking-widest text-link">{t('my.page.title')}</h1>
      <p className="mt-3 text-title font-bold break-keep lg:text-display">
        {t('my.page.greeting')}
      </p>
      <p className="mt-3 text-body-sm text-text/70 break-keep">{renderNext()}</p>
      <ul aria-label={t('my.summary.label')} className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ key, count, unit, href }) => (
          <li key={key}>
            <a
              href={`#${href}`}
              className="flex h-full flex-col gap-1 rounded-2xl bg-background p-4 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-5"
            >
              <span className="text-body-sm text-text/70">{t(`my.summary.${key}`)}</span>
              <span className="text-title font-bold">{t(`my.summary.${unit}`, { count })}</span>
            </a>
          </li>
        ))}
      </ul>
    </header>
  );
}
