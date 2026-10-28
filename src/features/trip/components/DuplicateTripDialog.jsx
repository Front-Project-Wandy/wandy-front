import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Modal from '../../../components/common/Modal';
import { addDays, toDateString } from '../../../store/plan/planDays';
import { formatDayDate } from '../utils/formatDay';
import { validateDuplicateForm } from '../utils/validateDuplicate';

const MAX_TITLE_LENGTH = 40;

// 원본 여행이 끝난 다음 날(이미 지났으면 오늘)을 기본 가는 날로 둔다
const getDefaultStartDate = (trip, today) => {
  const next = trip.endDate ? addDays(trip.endDate, 1) : today;
  return next < today ? today : next;
};

function DuplicateTripForm({ trip, onSubmit, onCancel }) {
  const { t, i18n } = useTranslation();
  // 창을 연 날을 기준으로 한 번만 정한다 (렌더마다 새로 구하지 않는다)
  const [today] = useState(() => toDateString(new Date()));
  const [title, setTitle] = useState(() =>
    t('planner.duplicate.defaultTitle', {
      title: trip.title || t('planner.duplicate.untitled'),
    }),
  );
  const [startDate, setStartDate] = useState(() => getDefaultStartDate(trip, today));
  const [errors, setErrors] = useState({});

  const dayCount = trip.days.length;
  const endDate = startDate ? addDays(startDate, dayCount - 1) : null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateDuplicateForm({ startDate }, today);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSubmit({ title: title.trim() || t('planner.duplicate.untitled'), startDate });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Input
        label={t('planner.duplicate.titleLabel')}
        value={title}
        maxLength={MAX_TITLE_LENGTH}
        onChange={(event) => setTitle(event.target.value)}
      />
      <Input
        label={t('planner.duplicate.startDate')}
        type="date"
        min={today}
        value={startDate}
        onChange={(event) => {
          setStartDate(event.target.value);
          setErrors({});
        }}
        error={errors.startDate ? t(errors.startDate) : undefined}
      />
      {endDate && !errors.startDate ? (
        <p className="text-body-sm text-text/70">
          {t('planner.duplicate.summary', {
            days: dayCount,
            start: formatDayDate(startDate, i18n.language),
            end: formatDayDate(endDate, i18n.language),
          })}
        </p>
      ) : null}
      <p className="text-body-sm text-text/70">{t('planner.duplicate.note')}</p>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>
          {t('planner.duplicate.cancel')}
        </Button>
        <Button type="submit">{t('planner.duplicate.submit')}</Button>
      </div>
    </form>
  );
}

// 지금 여는 여행을 새 날짜로 통째로 복제하는 창 (71). 열 때마다 새로 그려서 이전에 쓴 값이 남지 않는다.
export default function DuplicateTripDialog({ open, onClose, trip, onSubmit }) {
  const { t } = useTranslation();

  return (
    <Modal open={open} onClose={onClose} title={t('planner.duplicate.title')}>
      {open ? <DuplicateTripForm trip={trip} onSubmit={onSubmit} onCancel={onClose} /> : null}
    </Modal>
  );
}
