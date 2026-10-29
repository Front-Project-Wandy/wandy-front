import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';

// 일정 편집을 되돌리거나 다시 실행하는 버튼 두 개 (71). 되돌릴 게 없으면 누를 수 없게 한다.
// message는 방금 한 일을 낭독기가 읽어 주는 글자다. 같은 글자가 이어져도 다시 읽도록 id가 바뀌면 새로 그린다.
export default function UndoRedoBar({ canUndo, canRedo, onUndo, onRedo, message }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        disabled={!canUndo}
        aria-keyshortcuts="Control+Z Meta+Z"
        onClick={onUndo}
      >
        {t('planner.history.undo')}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled={!canRedo}
        aria-keyshortcuts="Control+Shift+Z Meta+Shift+Z Control+Y"
        onClick={onRedo}
      >
        {t('planner.history.redo')}
      </Button>
      <span key={message.id} role="status" className="sr-only">
        {message.text}
      </span>
    </div>
  );
}
