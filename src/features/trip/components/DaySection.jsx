import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import TransportLeg from '../../transport/components/TransportLeg';
import { getFlightTimeWarnings } from '../utils/checkFlightTime';
import { getDayDropId } from '../utils/dragPosition';
import { formatDayDate } from '../utils/formatDay';
import DayItem from './DayItem';
import SortableDayItem from './SortableDayItem';

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
  // DAY 칸 전체가 놓을 수 있는 자리다. 장소가 없는 DAY나 맨 끝에 놓을 때 쓴다 (16).
  const { setNodeRef, isOver } = useDroppable({ id: getDayDropId(dayIndex) });

  return (
    <section ref={setNodeRef} aria-labelledby={titleId} className="space-y-3">
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
        <p
          className={`rounded-2xl bg-bg-soft px-4 py-6 text-center text-body-sm text-text/70 ${isOver ? 'ring-2 ring-primary' : ''}`}
        >
          {t('planner.day.empty')}
        </p>
      ) : (
        <SortableContext
          items={day.items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <ol className="space-y-2">
            {day.items.map((item, index) => (
              // 구간 교통은 카드 아래에 같은 묶음으로 둬서, 카드를 옮기면 함께 움직인다
              <SortableDayItem key={item.id} id={item.id}>
                {(dragHandleProps) => (
                  <>
                    <DayItem
                      item={item}
                      number={index + 1}
                      dayIndex={dayIndex}
                      isTimeOutOfOrder={
                        index > 0 && item.startTime < day.items[index - 1].startTime
                      }
                      flightWarnings={getFlightTimeWarnings({ flight, date: day.date, item })}
                      isSelected={item.id === selectedItemId}
                      dragHandleProps={dragHandleProps}
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
                        showDirections
                        className="pl-21"
                      />
                    ) : null}
                  </>
                )}
              </SortableDayItem>
            ))}
          </ol>
        </SortableContext>
      )}
    </section>
  );
}
