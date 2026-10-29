import { useEffect, useId, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Button from './Button';

// 브라우저 기본 <dialog>를 쓴다. showModal()로 열면 뒤 화면을 못 누르게 막고,
// 포커스를 창 안에 가두고, ESC 처리까지 브라우저가 해 줘서 직접 만들 것이 적다.
// 열림 여부는 부모의 open이 정하고, 닫는 동작(ESC·바깥 클릭·닫기 버튼)은 전부 onClose로 알린다.
export default function Modal({ open, onClose, title, children }) {
  const { t } = useTranslation();
  const dialogRef = useRef(null);
  const titleId = useId();

  // dialog는 open 속성 대신 showModal()/close()로 열고 닫아야 뒤 화면이 막힌다.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // ESC를 누르면 브라우저가 바로 닫아 버리는데, 그러면 부모의 open과 어긋나서 막고 부모에게 맡긴다.
  const handleCancel = (event) => {
    event.preventDefault();
    onClose();
  };

  // 안쪽 내용이 dialog를 꽉 채우고 있어서, target이 dialog 자신이면 바깥 어두운 부분을 누른 것이다.
  const handleClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  // 뒤 화면 덮개는 테마와 상관없이 어둡게 (ink). text는 다크모드에서 밝아져 덮개가 오히려 밝아진다.
  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onClick={handleClick}
      className="motion-dialog mx-auto mt-auto mb-0 w-full max-w-none rounded-t-2xl bg-background text-text backdrop:bg-ink/50 sm:m-auto sm:max-w-lg sm:rounded-2xl"
    >
      <div className="flex items-center justify-between gap-2 border-b border-text/10 px-4 py-3">
        <h2 id={titleId} className="text-subtitle font-bold">
          {title}
        </h2>
        <Button variant="ghost" size="sm" aria-label={t('common.action.close')} onClick={onClose}>
          <span aria-hidden="true">✕</span>
        </Button>
      </div>
      <div className="p-4">{children}</div>
    </dialog>
  );
}
