import { useTranslation } from 'react-i18next';
import { useItemName } from '../hooks/useItemName';
import NumberBadge from './NumberBadge';

// 끄는 동안 손가락·마우스를 따라다니는 카드 모양 (16). 이름·시간만 보여 준다.
export default function DragPreview({ item, number, dayIndex }) {
  const { t } = useTranslation();
  const name = useItemName(item);

  return (
    <div
      data-drag-preview
      className="flex items-center gap-3 rounded-2xl border border-primary bg-background p-3 shadow-md"
    >
      <NumberBadge number={number} dayIndex={dayIndex} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-body font-bold">{name}</span>
        <span className="block text-body-sm text-text/70">
          {item.startTime} · {t('planner.item.stay', { minutes: item.stayMinutes })}
        </span>
      </span>
    </div>
  );
}
