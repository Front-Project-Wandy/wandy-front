import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import Chip from '../../../components/common/Chip';
import { useAssistantChat } from '../hooks/useAssistantChat';
import AssistantMessage from './AssistantMessage';

// 처음 열었을 때 눌러서 바로 물어볼 수 있는 예시
const SUGGESTION_KEYS = ['schedule', 'cost', 'add'];

// 대화형 여행 비서 창 (101). 모바일은 아래에서 올라오는 시트, PC는 오른쪽 아래 패널.
// 일정을 보면서 대화할 수 있게 뒤 화면을 막지 않는다(모달 아님). Esc나 닫기로 닫고, 닫으면 여는 버튼으로 포커스가 돌아간다.
export default function AssistantPanel({ trip, onClose }) {
  const { t } = useTranslation();
  const titleId = useId();
  const inputRef = useRef(null);
  const listEndRef = useRef(null);
  const [text, setText] = useState('');
  const { messages, send, retry, apply, dismiss, isPending, isError } = useAssistantChat(trip);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 새 말이 오면 맨 아래로 내린다
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length, isPending]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!text.trim() || isPending) return;
    send(text);
    setText('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') onClose();
  };

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      onKeyDown={handleKeyDown}
      className="fixed inset-x-0 bottom-0 z-40 flex h-4/5 flex-col rounded-t-2xl border border-text/10 bg-background shadow-lg print:hidden lg:inset-x-auto lg:right-6 lg:bottom-6 lg:h-160 lg:w-96 lg:rounded-2xl"
    >
      <header className="flex items-center justify-between gap-2 border-b border-text/10 px-4 py-3">
        <div>
          <h2 id={titleId} className="text-body font-bold">
            {t('ai.assistant.title')}
          </h2>
          <p className="text-caption text-text/60">{t('ai.assistant.subtitle')}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          {t('common.action.close')}
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-3" aria-live="polite">
        {messages.length === 0 ? (
          <div className="space-y-3">
            <p className="text-body-sm text-text/70">{t('ai.assistant.intro')}</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTION_KEYS.map((key) => (
                <Chip
                  key={key}
                  label={t(`ai.assistant.suggestion.${key}`)}
                  selected={false}
                  onClick={() => send(t(`ai.assistant.suggestion.${key}`))}
                />
              ))}
            </div>
          </div>
        ) : null}
        <ul className="space-y-3">
          {messages.map((message) => (
            <AssistantMessage
              key={message.id}
              message={message}
              onApply={apply}
              onDismiss={dismiss}
            />
          ))}
        </ul>
        {isPending ? (
          <p className="mt-3 text-body-sm text-text/60">{t('ai.assistant.thinking')}</p>
        ) : null}
        {isError && !isPending ? (
          <div className="mt-3 flex items-center gap-2">
            <p role="alert" className="text-body-sm text-error">
              {t('ai.assistant.error')}
            </p>
            <Button variant="secondary" size="sm" onClick={retry}>
              {t('common.action.retry')}
            </Button>
          </div>
        ) : null}
        <div ref={listEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-text/10 p-3">
        <label htmlFor={`${titleId}-input`} className="sr-only">
          {t('ai.assistant.inputLabel')}
        </label>
        <input
          id={`${titleId}-input`}
          ref={inputRef}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={t('ai.assistant.placeholder')}
          maxLength={300}
          autoComplete="off"
          className="h-11 min-w-0 flex-1 rounded-xl border border-text/20 bg-background px-3 text-body outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <Button type="submit" disabled={!text.trim() || isPending}>
          {t('ai.assistant.send')}
        </Button>
      </form>
    </section>
  );
}
