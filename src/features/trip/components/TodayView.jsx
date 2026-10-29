import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Chip from '../../../components/common/Chip';
import EmptyState from '../../../components/common/EmptyState';
import GoogleAttribution from '../../search/components/GoogleAttribution';
import { useNow } from '../hooks/useNow';
import { useVisitedItems } from '../hooks/useVisitedItems';
import { getTodayDayIndex, pickNextItem, toLocalDateString } from '../utils/pickNextItem';
import TodayItem from './TodayItem';
import TodayNextCard from './TodayNextCard';

// 여행 당일에 보는 「오늘 일정」 화면 (요구사항 #93). 목록·타임라인 보기와 같은 자리에 들어간다.
// 오늘이 여행 기간 밖이면(시연·미리 보기) 보고 싶은 날을 골라 그날을 오늘처럼 본다. 시각은 지금 시각을 쓴다.
export default function TodayView({ tripId, days, country, transportMode }) {
  const { t } = useTranslation();
  const now = useNow();
  const { visitedIds, toggle } = useVisitedItems(tripId);
  const [pickedIndex, setPickedIndex] = useState(null);

  const todayIndex = getTodayDayIndex(days, toLocalDateString(now));
  const dayIndex = pickedIndex ?? (todayIndex >= 0 ? todayIndex : 0);
  const day = days[dayIndex];
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const { nextItem, minutesUntil } = pickNextItem({ items: day.items, visitedIds, nowMinutes });
  const hasGooglePlace = day.items.some((item) => item.source === 'google');

  const renderBody = () => {
    if (day.items.length === 0) return <EmptyState title={t('planner.today.empty')} />;
    return (
      <>
        {nextItem ? (
          <TodayNextCard
            key={nextItem.id}
            item={nextItem}
            minutesUntil={minutesUntil}
            country={country}
            transportMode={transportMode}
          />
        ) : (
          <p className="rounded-2xl bg-bg-soft p-4 text-body font-bold">
            {t('planner.today.allDone')}
          </p>
        )}
        <ul className="space-y-2">
          {day.items.map((item, index) => (
            <TodayItem
              key={item.id}
              item={item}
              number={index + 1}
              dayIndex={dayIndex}
              isVisited={visitedIds.includes(item.id)}
              isNext={nextItem?.id === item.id}
              onToggle={toggle}
            />
          ))}
        </ul>
        {hasGooglePlace ? <GoogleAttribution /> : null}
      </>
    );
  };

  return (
    <div className="space-y-4">
      {todayIndex < 0 ? (
        <div className="space-y-2">
          <p className="text-body-sm text-text/70">{t('planner.today.notInRange')}</p>
          <div
            role="group"
            aria-label={t('planner.today.pickDay')}
            className="flex flex-wrap gap-2"
          >
            {days.map((item, index) => (
              <Chip
                key={item.date}
                label={t('planner.today.dayLabel', { number: index + 1 })}
                selected={index === dayIndex}
                onClick={() => setPickedIndex(index)}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-body-sm text-text/70">
          {t('planner.today.dayHeading', { number: dayIndex + 1, date: day.date })}
        </p>
      )}
      {renderBody()}
    </div>
  );
}
