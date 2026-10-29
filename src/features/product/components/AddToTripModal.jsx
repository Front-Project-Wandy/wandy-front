import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button';
import Chip from '../../../components/common/Chip';
import EmptyState from '../../../components/common/EmptyState';
import Modal from '../../../components/common/Modal';
import { toDateString } from '../../../store/plan/planDays';
import { useAllTrips } from '../../../store/plan/useAllTrips';
import { formatDayDate } from '../../trip/utils/formatDay';
import { useAddProductToTrip } from '../hooks/useAddProductToTrip';
import { hasProductInItems, pickTripsForProduct } from '../utils/productPlanItem';

const OPTION_CLASS =
  'w-full rounded-xl border px-4 py-3 text-left motion-press transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

// 상품 상세의 [일정에 넣기] 창 (84). 같은 나라·도시의 내 여행(지금 여행 + 보관함)과 DAY를 골라 넣는다.
// 열 때마다 처음 상태로 시작하도록 부모가 열려 있을 때만 그린다 (OptimizeDayDialog와 같은 방식).
// <AddToTripModal open onClose={...} product={product} />
export default function AddToTripModal({ open, onClose, product }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const allTrips = useAllTrips();
  const addProductToTrip = useAddProductToTrip();
  // 오늘 날짜는 창을 연 순간 한 번만 정한다 (그릴 때마다 new Date()를 부르지 않게)
  const [today] = useState(() => toDateString(new Date()));
  const trips = useMemo(
    () => pickTripsForProduct(allTrips, product, today),
    [allTrips, product, today],
  );
  const [tripId, setTripId] = useState(trips[0]?.id ?? null);
  const [dayIndex, setDayIndex] = useState(0);
  // 넣은 뒤에는 { tripId, dayIndex }로 완료 안내를 보여 준다
  const [added, setAdded] = useState(null);

  const city = t(`common.city.${product.city}`);
  const getTitle = (trip) => trip.title || t('product.addToTrip.untitled', { city });
  const selectedTrip = trips.find((trip) => trip.id === (added?.tripId ?? tripId));
  const selectedDay = selectedTrip?.days[dayIndex];
  const isDuplicate = selectedDay ? hasProductInItems(selectedDay.items, product.id) : false;

  const handleSelectTrip = (id) => {
    setTripId(id);
    setDayIndex(0);
  };
  const handleSubmit = () => {
    if (addProductToTrip({ tripId, dayIndex, product })) setAdded({ tripId, dayIndex });
  };
  const handleCreate = () => navigate('/plan/new');

  const renderBody = () => {
    if (added && selectedTrip)
      return (
        <div className="space-y-4">
          <p role="status" className="text-body break-keep">
            {t('product.addToTrip.done', {
              trip: getTitle(selectedTrip),
              number: added.dayIndex + 1,
            })}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row-reverse">
            <Link
              to={`/trip/${selectedTrip.id}`}
              className="flex h-11 flex-1 items-center justify-center rounded-xl bg-primary px-4 text-body font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {t('product.addToTrip.goToTrip')}
            </Link>
            <Button variant="secondary" className="flex-1" onClick={onClose}>
              {t('common.action.close')}
            </Button>
          </div>
        </div>
      );
    if (trips.length === 0)
      return (
        <EmptyState
          className="py-6"
          title={t('product.addToTrip.emptyTitle', { city })}
          description={t('product.addToTrip.emptyDescription', { city })}
          action={<Button onClick={handleCreate}>{t('product.addToTrip.create')}</Button>}
        />
      );
    return (
      <div className="space-y-5">
        <fieldset className="space-y-2">
          <legend className="mb-2 text-body-sm font-bold">
            {t('product.addToTrip.tripLabel')}
          </legend>
          <ul className="max-h-60 space-y-2 overflow-y-auto">
            {trips.map((trip) => (
              <li key={trip.id}>
                <button
                  type="button"
                  aria-pressed={trip.id === tripId}
                  onClick={() => handleSelectTrip(trip.id)}
                  className={`${OPTION_CLASS} ${trip.id === tripId ? 'border-primary bg-bg-soft' : 'border-text/20 bg-background hover:bg-bg-soft'}`}
                >
                  <span className="block truncate text-body font-bold">{getTitle(trip)}</span>
                  <span className="block text-body-sm text-text/70">
                    {t('product.addToTrip.dates', { start: trip.startDate, end: trip.endDate })}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </fieldset>
        {selectedTrip ? (
          <fieldset>
            <legend className="mb-2 text-body-sm font-bold">
              {t('product.addToTrip.dayLabel')}
            </legend>
            <div className="flex flex-wrap gap-2">
              {selectedTrip.days.map((day, index) => (
                <Chip
                  key={day.date}
                  label={t('product.addToTrip.day', {
                    number: index + 1,
                    date: formatDayDate(day.date, i18n.language),
                  })}
                  selected={index === dayIndex}
                  onClick={() => setDayIndex(index)}
                />
              ))}
            </div>
          </fieldset>
        ) : null}
        {isDuplicate ? (
          <p className="text-body-sm text-text/70">{t('product.addToTrip.duplicate')}</p>
        ) : null}
        <Button className="w-full" disabled={!selectedDay || isDuplicate} onClick={handleSubmit}>
          {t('product.addToTrip.submit', { number: dayIndex + 1 })}
        </Button>
      </div>
    );
  };

  return (
    <Modal open={open} onClose={onClose} title={t('product.addToTrip.title')}>
      {renderBody()}
    </Modal>
  );
}
