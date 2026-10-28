import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DayTransportSummary from '../../transport/components/DayTransportSummary';
import { buildTimeline } from '../utils/buildTimeline';
import { formatDayDate } from '../utils/formatDay';
import TimelineItem from './TimelineItem';

// 한 DAY의 제목(이동 합계·과밀 경고 포함)과 그날의 타임라인 (80).
export default function TimelineDay({
  day,
  dayIndex,
  country,
  transportMode,
  style,
  selectedItemId,
  onSelectItem,
}) {
  const { t, i18n } = useTranslation();
  const titleId = `timeline-day-title-${dayIndex}`;
  const entries = useMemo(
    () => buildTimeline({ items: day.items, country, transportMode }),
    [day.items, country, transportMode],
  );

  return (
    <section aria-labelledby={titleId} className="space-y-3">
      <div className="min-w-0">
        <h2 id={titleId} className="text-subtitle font-bold">
          {t('planner.day.title', { number: dayIndex + 1 })}
          <span className="ml-2 text-body-sm font-normal text-text/70">
            {formatDayDate(day.date, i18n.language)}
          </span>
        </h2>
        <DayTransportSummary
          items={day.items}
          country={country}
          transportMode={transportMode}
          style={style}
        />
      </div>
      {entries.length === 0 ? (
        <p className="rounded-2xl bg-bg-soft px-4 py-6 text-center text-body-sm text-text/70">
          {t('planner.day.empty')}
        </p>
      ) : (
        <ol>
          {entries.map((entry, index) => (
            <TimelineItem
              key={entry.item.id}
              entry={entry}
              number={index + 1}
              dayIndex={dayIndex}
              isLast={index === entries.length - 1}
              isSelected={entry.item.id === selectedItemId}
              onSelect={onSelectItem}
            />
          ))}
        </ol>
      )}
    </section>
  );
}
