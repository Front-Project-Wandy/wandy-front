import { useEffect } from 'react';

// 글자를 쓰는 곳에서는 브라우저 자체 되돌리기가 동작해야 해서 건드리지 않는다
const isEditable = (element) =>
  element instanceof HTMLElement &&
  (element.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName));

// 장소를 끄는 중(DragPreview가 보이는 동안)이나 창(dialog)이 열려 있을 때는 일정이 뒤에서 바뀌면 안 된다
const isBusy = () =>
  document.querySelector('[data-drag-preview]') !== null ||
  document.querySelector('dialog[open]') !== null;

// Ctrl/Cmd+Z는 되돌리기, Shift+Ctrl/Cmd+Z와 Ctrl+Y는 다시 실행 (71).
export function useUndoShortcut({ onUndo, onRedo, enabled = true }) {
  useEffect(() => {
    if (!enabled) return undefined;

    const handleKeyDown = (event) => {
      const hasModifier = event.ctrlKey || event.metaKey;
      if (!hasModifier || event.altKey || isEditable(event.target) || isBusy()) return;

      const key = event.key.toLowerCase();
      if (key === 'z') {
        event.preventDefault();
        if (event.shiftKey) onRedo();
        else onUndo();
      } else if (key === 'y' && event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        onRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUndo, onRedo, enabled]);
}
