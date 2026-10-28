import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button';
import EmptyState from '../../../components/common/EmptyState';
import { useAllTrips } from '../../../store/plan/useAllTrips';
import { groupMyTrips } from '../utils/groupMyTrips';
import { getLocalDateString } from '../utils/tripDates';
import TripCard from './TripCard';

// 마이페이지 내 여행 (36). 예정(진행 중·날짜 미정 포함)과 지난 여행을 나눠 보여준다.
// 지금 여는 여행과 보관함 여행을 모두 보여준다 (useAllTrips, C). 플랜 store는 읽기만 한다.
// 보관함 여행을 눌러도 플래너가 주소의 id로 그 여행을 연다.
export default function MyTrips() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const titleId = useId();
  const trips = useAllTrips();
  const today = getLocalDateString();
  const { upcoming, past } = groupMyTrips(trips, today);

  const renderGroup = (label, items) =>
    items.length > 0 ? (
      <div className="space-y-3">
        <h3 className="text-body font-bold text-text/70">{label}</h3>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ trip: item, status }) => (
            <TripCard
              key={item.id}
              trip={item}
              status={status}
              today={today}
              onSelect={(selected) => navigate(`/trip/${selected.id}`)}
            />
          ))}
        </ul>
      </div>
    ) : null;

  return (
    <section aria-labelledby={titleId} className="space-y-5">
      <h2 id={titleId} className="text-title font-bold">
        {t('my.trips.title')}
      </h2>
      {trips.length === 0 ? (
        <EmptyState
          title={t('my.trips.emptyTitle')}
          description={t('my.trips.emptyDescription')}
          className="rounded-2xl bg-bg-soft"
          action={<Button onClick={() => navigate('/plan/new')}>{t('my.trips.create')}</Button>}
        />
      ) : (
        <div className="space-y-8">
          {renderGroup(t('my.trips.upcoming'), upcoming)}
          {renderGroup(t('my.trips.past'), past)}
        </div>
      )}
    </section>
  );
}
