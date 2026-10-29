import { useTranslation } from 'react-i18next';
import AssistantActionPreview from './AssistantActionPreview';

// 비서 대화의 말풍선 하나 (101). 내 말은 오른쪽, 비서 말은 왼쪽. 비서가 일정 변경을 제안했으면 미리보기를 붙인다.
// 키가 없어 가짜 비서가 답했으면 그렇다고 작게 알린다 (진짜 AI 답으로 오해하지 않게).
export default function AssistantMessage({ message, onApply, onDismiss }) {
  const { t } = useTranslation();
  const isUser = message.role === 'user';

  return (
    <li className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <span className="sr-only">
        {isUser ? t('ai.assistant.speaker.user') : t('ai.assistant.speaker.assistant')}
      </span>
      <div
        className={`max-w-xs rounded-2xl px-3 py-2 text-body-sm whitespace-pre-line break-keep ${isUser ? 'bg-primary/10' : 'border border-text/10 bg-bg-soft'}`}
      >
        {message.text || t('ai.assistant.emptyReply')}
        {message.actions?.length > 0 ? (
          <AssistantActionPreview message={message} onApply={onApply} onDismiss={onDismiss} />
        ) : null}
      </div>
      {message.source === 'mock' ? (
        <p className="mt-1 text-caption text-text/60">{t('ai.assistant.mockNote')}</p>
      ) : null}
    </li>
  );
}
