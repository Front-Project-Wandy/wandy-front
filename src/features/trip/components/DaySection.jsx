import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import TransportLeg from '../../transport/components/TransportLeg';
import { getFlightTimeWarnings } from '../utils/checkFlightTime';
import { formatDayDate } from '../utils/formatDay';
import DayItem from './DayItem';

// 한 DAY의 제목(DAY 1 · 10월 26일 (월))과 그날의 장소 목록, 장소 추가 버튼.
export default function DaySection({
  day,
  dayIndex,
  country,
  transportMode,
  flight,
  selectedItemId,
  onSelectItem,
  onAddPlace,
  onUpdateItem,
  onRemoveItem,
}) {
  const { t, i18n } = useTranslation();
  const titleId = `day-title-${dayIndex}`;
  const handleAddPlace = () => onAddPlace(dayIndex);
  const handleUpdateItem = (itemId, patch) => onUpdateItem(dayIndex, itemId, patch);
  const handleRemoveItem = (itemId) => onRemoveItem(dayIndex, itemId);

  return (
    <section aria-labelledby={titleId} className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 id={titleId} className="text-subtitle font-bold">
          {t('planner.day.title', { number: dayIndex + 1 })}
          <span className="ml-2 text-body-sm font-normal text-text/70">
            {formatDayDate(day.date, i18n.language)}
          </span>
        </h2>
        {/* 버튼 글자는 DAY마다 같아서, 낭독기가 어느 DAY인지 알 수 있게 번호를 붙인다 */}
        <Button
          variant="secondary"
          aria-label={t('planner.day.addPlaceLabel', { number: dayIndex + 1 })}
          onClick={handleAddPlace}
        >
          {t('planner.day.addPlace')}
        </Button>
      </div>
      {day.items.length === 0 ? (
        <p className="rounded-2xl bg-bg-soft px-4 py-6 text-center text-body-sm text-text/70">
          {t('planner.day.empty')}
        </p>
      ) : (
        <ol className="space-y-2">
          {day.items.map((item, index) => (
            <Fragment key={item.id}>
              <DayItem
                item={item}
                number={index + 1}
                isTimeOutOfOrder={index > 0 && item.startTime < day.items[index - 1].startTime}
                flightWarnings={getFlightTimeWarnings({ flight, date: day.date, item })}
                isSelected={item.id === selectedItemId}
                onSelect={onSelectItem}
                onUpdate={handleUpdateItem}
                onRemove={handleRemoveItem}
              />
              {index < day.items.length - 1 ? (
                <TransportLeg
                  from={item}
                  to={day.items[index + 1]}
                  country={country}
                  transportMode={transportMode}
                />
              ) : null}
            </Fragment>
          ))}
        </ol>
      )}
    </section>
  );
}
