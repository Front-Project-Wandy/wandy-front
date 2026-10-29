import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AssistantPanel from './AssistantPanel';

// 플래너 오른쪽 아래의 「여행 비서」 버튼 (101). 누르면 대화 창을 열고, 닫으면 이 버튼으로 포커스를 돌려준다.
// 대화는 창을 닫으면 사라진다(화면에만 둔다). 여행이 바뀌면 플래너가 key로 새로 만든다.
export default function AssistantLauncher({ trip }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);

  const handleClose = () => {
    setIsOpen(false);
    // 창이 사라진 뒤에 버튼이 다시 그려지므로 다음 틀에 포커스를 옮긴다
    requestAnimationFrame(() => buttonRef.current?.focus());
  };

  if (isOpen) return <AssistantPanel trip={trip} onClose={handleClose} />;

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={() => setIsOpen(true)}
      aria-haspopup="dialog"
      className="motion-press fixed right-4 bottom-4 z-30 flex h-12 items-center gap-2 rounded-full bg-primary px-5 text-body font-bold text-white shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary print:hidden lg:right-6 lg:bottom-6"
    >
      <span aria-hidden="true">✦</span>
      {t('ai.assistant.open')}
    </button>
  );
}
