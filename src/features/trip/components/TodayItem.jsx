import { useTranslation } from 'react-i18next';
import { useItemName } from '../hooks/useItemName';
import NumberBadge from './NumberBadge';

// 오늘 일정의 장소 한 줄: 번호, 시작 시각, 이름과 「다녀옴」 체크 (요구사항 #93). 다녀온 곳은 흐리게 보인다.
export default function TodayItem({ item, number, dayIndex, isVisited, isNext, onToggle }) {
  const { t } = useTranslation();
  const name = useItemName(item);

  return (
    <li
      className={`flex items-center gap-3 rounded-2xl border p-3 ${isNext ? 'border-primary bg-bg-soft' : 'border-text/10 bg-background'} ${isVisited ? 'opacity-60' : ''}`}
    >
      <NumberBadge number={number} dayIndex={dayIndex} />
      <div className="min-w-0 flex-1">
        <p className="text-body-sm text-text/70">
          {item.startTime} · {t('planner.item.stay', { minutes: item.stayMinutes })}
        </p>
        <p className={`truncate text-body font-bold ${isVisited ? 'line-through' : ''}`}>{name}</p>
      </div>
      <label className="flex shrink-0 items-center gap-2 text-body-sm">
        <input
          type="checkbox"
          checked={isVisited}
          onChange={() => onToggle(item.id)}
          aria-label={t('planner.today.visitedLabel', { name })}
          className="size-5 accent-primary"
        />
        {t('planner.today.visited')}
      </label>
    </li>
  );
}
