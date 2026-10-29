import { useTranslation } from 'react-i18next';
import { useItemName } from '../../trip/hooks/useItemName';

// 비서가 제안한 일정 변경 한 줄 (101). 일정에 있는 장소는 구글 장소일 수 있어서 이름을 useItemName으로 불러온다.
// action: validateAssistantActions 결과 하나, item: 지금 store에 있는 그 장소(add면 null)
export default function AssistantActionRow({ action, item }) {
  const { t } = useTranslation();
  const name = useItemName(item ?? { name: action.place?.name ?? '' });

  const text = () => {
    if (action.type === 'add') {
      return t('ai.assistant.action.add', {
        day: action.dayIndex + 1,
        name,
        time: action.startTime,
        minutes: action.stayMinutes,
      });
    }
    if (action.type === 'remove')
      return t('ai.assistant.action.remove', { day: action.dayIndex + 1, name });
    if (action.type === 'move') {
      return t('ai.assistant.action.move', {
        name,
        from: action.dayIndex + 1,
        to: action.toDayIndex + 1,
      });
    }
    const { startTime, stayMinutes } = action.patch;
    if (startTime && stayMinutes) {
      return t('ai.assistant.action.updateBoth', { name, time: startTime, minutes: stayMinutes });
    }
    return startTime
      ? t('ai.assistant.action.updateTime', { name, time: startTime })
      : t('ai.assistant.action.updateStay', { name, minutes: stayMinutes });
  };

  return <li className="break-keep">{text()}</li>;
}
