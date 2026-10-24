import { useTranslation } from 'react-i18next';
import { formatDayDate } from '../utils/formatDay';
import DayItem from './DayItem';

// 한 DAY의 제목(DAY 1 · 10월 26일 (월))과 그날의 장소 목록.
export default function DaySection({ day, dayIndex }) {
  const { t, i18n } = useTranslation();
  const titleId = `day-title-${dayIndex}`;

  return (
    <section aria-labelledby={titleId} className="space-y-3">
      <h2 id={titleId} className="text-subtitle font-bold">
        {t('planner.day.title', { number: dayIndex + 1 })}
        <span className="ml-2 text-body-sm font-normal text-text/70">
          {formatDayDate(day.date, i18n.language)}
        </span>
      </h2>
      {day.items.length === 0 ? (
        <p className="rounded-2xl bg-bg-soft px-4 py-6 text-center text-body-sm text-text/70">
          {t('planner.day.empty')}
        </p>
      ) : (
        <ol className="space-y-2">
          {day.items.map((item, index) => (
            <DayItem key={item.id} item={item} number={index + 1} />
          ))}
        </ol>
      )}
    </section>
  );
}
