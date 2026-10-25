import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import Chip from '../../../components/common/Chip';
import Modal from '../../../components/common/Modal';
import { formatShortDate } from '../../../features/member/utils/tripDates';

// "어느 날 갈까요?" — 장소를 누르면 뜨는 창 (와이어프레임 W05 "장소 상세를 열고 원하는 DAY에 추가").
// 이미 담은 장소면 그 날이 골라진 채로 열리고, 날짜를 옮기거나 뺄 수 있다.
// 부모가 key를 장소마다 바꿔 줘서, 다른 장소를 열면 고른 날짜가 새로 시작된다.
export default function AddSpotModal({
  place,
  days,
  currentDayIndex,
  onSubmit,
  onRemove,
  onClose,
}) {
  const { t, i18n } = useTranslation();
  const [dayIndex, setDayIndex] = useState(currentDayIndex ?? 0);
  const isAdded = currentDayIndex !== null;

  return (
    <Modal open={place !== null} onClose={onClose} title={place?.name ?? ''}>
      {place && (
        <div className="flex flex-col gap-5">
          <p className="text-body-sm text-text/70">
            {t(`common.category.${place.category}`)}
            {place.address && ` · ${place.address}`}
          </p>
          {isAdded && (
            <p className="text-body-sm font-bold text-primary">
              {t('wizard.spots.modal.added', { day: currentDayIndex + 1 })}
            </p>
          )}

          <fieldset>
            <legend className="text-body-sm font-bold">{t('wizard.spots.modal.question')}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {days.map((day) => (
                <Chip
                  key={day.dayIndex}
                  label={t('wizard.spots.modal.dayOption', {
                    day: day.dayIndex + 1,
                    date: formatShortDate(day.date, i18n.language),
                  })}
                  selected={dayIndex === day.dayIndex}
                  onClick={() => setDayIndex(day.dayIndex)}
                />
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-2 sm:flex-row-reverse">
            <Button
              className="sm:flex-1"
              disabled={isAdded && dayIndex === currentDayIndex}
              onClick={() => onSubmit(dayIndex)}
            >
              {isAdded ? t('wizard.spots.modal.move') : t('wizard.spots.modal.add')}
            </Button>
            {isAdded && (
              <Button variant="secondary" className="sm:flex-1" onClick={onRemove}>
                {t('wizard.spots.modal.remove')}
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
