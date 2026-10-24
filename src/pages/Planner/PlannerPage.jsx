import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import DayList from '../../features/trip/components/DayList';
import { usePlanStore } from '../../store/plan/usePlanStore';

// /trip/:id — 플래너 (P01). 지금은 DAY별 일정 목록(12)까지.
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
    return <DayList days={trip.days} />;
  };

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 lg:px-6">
      <h1 className="text-title font-bold">{t('planner.page.title')}</h1>
      {renderBody()}
    </main>
  );
}
