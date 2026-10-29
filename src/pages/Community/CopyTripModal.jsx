import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { getTodayString, MAX_PEOPLE } from '../Wizard/validateBasicInfo';
import { copyPublicTrip, getCopyEndDate } from './copyPublicTrip';
import { getTripNights } from './publicTripUtils';

// 입력 검사. 문제가 있는 칸만 { 칸: 번역 키 }로 돌려준다 (마법사 기본 정보와 같은 기준).
const validate = ({ startDate, people }, today) => {
  const errors = {};
  const count = Number(people);
  if (!startDate) errors.startDate = 'community.copy.error.startDate';
  else if (startDate < today) errors.startDate = 'community.copy.error.pastDate';
  if (!Number.isInteger(count) || count < 1 || count > MAX_PEOPLE) {
    errors.people = 'community.copy.error.people';
  }
  return errors;
};

// 「내 여행으로 가져오기」 (105). 가는 날·인원·제목만 정하면 일정을 내 여행으로 복사하고 플래너를 연다.
// 열 때마다 처음 값으로 시작하도록 부모가 open일 때만 그린다.
export default function CopyTripModal({ trip, placesById, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const today = getTodayString();
  const [values, setValues] = useState({
    startDate: '',
    people: String(trip.people),
    title: trip.title,
  });
  const [errors, setErrors] = useState({});
  const nights = getTripNights(trip);

  const handleChange = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(values, today);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const tripId = copyPublicTrip({
      trip,
      placesById,
      startDate: values.startDate,
      people: Number(values.people),
      title: values.title.trim() || trip.title,
    });
    navigate(`/trip/${tripId}`);
  };

  return (
    <Modal open onClose={onClose} title={t('community.copy.title')}>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-body-sm text-text/70">
          {t('community.copy.description', { nights, days: nights + 1 })}
        </p>
        <Input
          type="date"
          label={t('community.copy.startDate')}
          value={values.startDate}
          min={today}
          onChange={handleChange('startDate')}
          error={errors.startDate && t(errors.startDate)}
        />
        {values.startDate && !errors.startDate ? (
          <p className="text-body-sm font-bold text-primary">
            {t('community.copy.period', {
              start: values.startDate,
              end: getCopyEndDate(trip, values.startDate),
            })}
          </p>
        ) : null}
        <Input
          type="number"
          label={t('community.copy.people')}
          value={values.people}
          min={1}
          max={MAX_PEOPLE}
          onChange={handleChange('people')}
          error={errors.people && t(errors.people, { max: MAX_PEOPLE })}
        />
        <Input
          label={t('community.copy.tripTitle')}
          value={values.title}
          onChange={handleChange('title')}
        />
        <p className="text-caption text-text/60">{t('community.copy.notice')}</p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            {t('community.copy.cancel')}
          </Button>
          <Button type="submit">{t('community.copy.submit')}</Button>
        </div>
      </form>
    </Modal>
  );
}
