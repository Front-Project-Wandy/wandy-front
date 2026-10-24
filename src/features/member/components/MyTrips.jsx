import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button';
import EmptyState from '../../../components/common/EmptyState';
import { usePlanStore } from '../../../store/plan/usePlanStore';
import { getLocalDateString, getTripStatus } from '../utils/tripDates';
import TripCard from './TripCard';

// 마이페이지 내 여행 (36). 예정(진행 중·날짜 미정 포함)과 지난 여행을 나눠 보여준다.
// 플랜 store(C)는 지금 여행을 하나만 저장해서 목록이 최대 1개다. 여러 개 저장은 회의 필요 14번에서 정한다.
// 플랜 store는 읽기만 한다.
export default function MyTrips() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const titleId = useId();
  const trip = usePlanStore((state) => state.trip);
  const today = getLocalDateString();

  const trips = (trip ? [trip] : []).map((item) => ({
    trip: item,
    status: getTripStatus(item, today),
  }));
  const upcoming = trips.filter(({ status }) => status !== 'past');
  const past = trips.filter(({ status }) => status === 'past');

  const renderGroup = (label, items) =>
    items.length > 0 ? (
      <div className="space-y-2">
        <h3 className="text-body font-bold text-text/70">{label}</h3>
        <ul className="space-y-2">
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
    <section aria-labelledby={titleId} className="space-y-3">
      <h2 id={titleId} className="text-subtitle font-bold">
        {t('my.trips.title')}
      </h2>
      {trips.length === 0 ? (
        <EmptyState
          title={t('my.trips.emptyTitle')}
          description={t('my.trips.emptyDescription')}
          action={<Button onClick={() => navigate('/plan/new')}>{t('my.trips.create')}</Button>}
        />
      ) : (
        <div className="space-y-4">
          {renderGroup(t('my.trips.upcoming'), upcoming)}
          {renderGroup(t('my.trips.past'), past)}
        </div>
      )}
    </section>
  );
}
