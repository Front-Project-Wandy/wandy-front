import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import AiFillButton from '../../features/ai/components/AiFillButton';
import MapView from '../../features/map/components/MapView';
import AddPlaceModal from '../../features/trip/components/AddPlaceModal';
import DayList from '../../features/trip/components/DayList';
import { usePlanStore } from '../../store/plan/usePlanStore';

// /trip/:id — 플래너 (P01). 지금은 DAY별 일정 목록(12), 장소 추가·삭제(13), 시간·메모 편집(17), 국가별 지도(6), 구간 교통(18), 항공 시간 경고(48), AI 빈 일정 채우기(55)까지.
export default function PlannerPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  // 필요한 값만 골라 구독해야 다른 값이 바뀔 때 다시 그려지지 않는다
  const trip = usePlanStore((state) => state.trip);
  const addItem = usePlanStore((state) => state.addItem);
  const updateItem = usePlanStore((state) => state.updateItem);
  const removeItem = usePlanStore((state) => state.removeItem);
  // 장소를 넣을 DAY 번호. null이면 장소 추가 창이 닫혀 있다.
  const [addingDayIndex, setAddingDayIndex] = useState(null);

  const handleCreate = () => navigate('/plan/new');
  const handleCloseModal = () => setAddingDayIndex(null);
  const handleSelectPlace = (place) => {
    addItem(addingDayIndex, place);
    setAddingDayIndex(null);
  };
  // AI가 만든 일정을 DAY별로 넣는다. 시작 시각·체류 시간은 처음부터 맞게 들어간다.
  const handleApplyAiFill = (days) => {
    days.forEach(({ dayIndex, items }) =>
      items.forEach(({ place, startTime, stayMinutes }) =>
        addItem(dayIndex, place, { startTime, stayMinutes }),
      ),
    );
  };
  // 여행이 정상으로 불러와졌을 때만 AI 채우기 버튼을 보여 준다
  const isTripReady = Boolean(trip) && trip.days.length > 0 && trip.id === id;
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
      <>
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <DayList
            days={trip.days}
            country={trip.country}
            transportMode={trip.transportMode}
            flight={trip.flight}
            onAddPlace={setAddingDayIndex}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
          />
          <MapView country={trip.country} city={trip.city} className="lg:sticky lg:top-6" />
        </div>
        <AddPlaceModal
          open={addingDayIndex !== null}
          onClose={handleCloseModal}
          title={t('planner.addPlace.title', { number: (addingDayIndex ?? 0) + 1 })}
          country={trip.country}
          city={trip.city}
          onSelectPlace={handleSelectPlace}
        />
      </>
    );
  };

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-title font-bold">{t('planner.page.title')}</h1>
        {isTripReady ? <AiFillButton trip={trip} onApply={handleApplyAiFill} /> : null}
      </div>
      {renderBody()}
    </main>
  );
}
