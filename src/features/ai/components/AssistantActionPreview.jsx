import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import { usePlanStore } from '../../../store/plan/usePlanStore';
import AssistantActionRow from './AssistantActionRow';

const findItem = (trip, itemId) =>
  trip?.days.flatMap((day) => day.items).find((item) => item.id === itemId) ?? null;

// 비서의 일정 변경 제안 미리보기 (101). AI가 바로 일정을 바꾸지 않고, 사용자가 [적용]을 눌러야 들어간다.
// 적용은 한 번에 묶여서 플래너의 [되돌리기] 한 번으로 모두 취소된다.
export default function AssistantActionPreview({ message, onApply, onDismiss }) {
  const { t } = useTranslation();
  const trip = usePlanStore((state) => state.trip);

  return (
    <div className="mt-2 space-y-2 rounded-xl border border-primary/30 bg-background p-3 text-body-sm">
      <p className="font-bold">{t('ai.assistant.preview.title')}</p>
      <ul className="list-disc space-y-1 pl-5">
        {message.actions.map((action, index) => (
          <AssistantActionRow
            key={`${action.type}-${action.itemId ?? action.place.id}-${index}`}
            action={action}
            item={action.type === 'add' ? null : findItem(trip, action.itemId)}
          />
        ))}
      </ul>
      {message.droppedCount > 0 ? (
        <p className="text-caption text-text/70">
          {t('ai.assistant.preview.dropped', { count: message.droppedCount })}
        </p>
      ) : null}
      {message.status === 'pending' ? (
        <div className="flex gap-2 pt-1">
          <Button size="sm" onClick={() => onApply(message.id)}>
            {t('ai.assistant.preview.apply')}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDismiss(message.id)}>
            {t('ai.assistant.preview.dismiss')}
          </Button>
        </div>
      ) : (
        <p className="font-bold text-text/70" aria-live="polite">
          {t(`ai.assistant.preview.${message.status}`)}
        </p>
      )}
    </div>
  );
}
