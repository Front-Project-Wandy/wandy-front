import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import MapView from '../../features/map/components/MapView';
import DayList from '../../features/trip/components/DayList';
import { usePlanStore } from '../../store/plan/usePlanStore';

// /trip/:id — 플래너 (P01). 지금은 DAY별 일정 목록(12)과 국가별 지도(6)까지.
export default function PlannerPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  // 필요한 값만 골라 구독해야 다른 값이 바뀔 때 다시 그려지지 않는다
  const trip = usePlanStore((state) => state.trip);

  const handleCreate = () => navigate('/plan/new');
  const createAction = <Button onClick={handleCreate}>{t('planner.empty.action')}</Button>;

  const renderBody = () => {
    if (!trip || trip.days.length === 0)
      return (
        <EmptyState
          title={t('planner.empty.title')}
          description={t('planner.empty.description')}
          action={createAction}
        />
      );
    if (trip.id !== id)
      return (
        <EmptyState
          title={t('planner.notFound.title')}
          description={t('planner.notFound.description')}
          action={createAction}
        />
      );
    // lg부터 목록과 지도를 좌우로 나눈다 (디자인 기준). 지도는 목록을 내려도 따라온다.
    return (
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <DayList days={trip.days} />
        <MapView country={trip.country} city={trip.city} className="lg:sticky lg:top-6" />
      </div>
    );
  };

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 lg:px-6">
      <h1 className="text-title font-bold">{t('planner.page.title')}</h1>
      {renderBody()}
    </main>
  );
}
