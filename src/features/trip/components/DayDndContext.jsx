import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useTranslation } from 'react-i18next';
import { collisionDetection, useItemDnd } from '../hooks/useItemDnd';
import DragPreview from './DragPreview';

// 장소를 끌어 순서를 바꾸거나 다른 DAY로 옮기는 범위 (16).
// children은 지금 보여 줄 days(끄는 동안은 미리 옮겨 본 days)를 받아 목록을 그리는 함수다.
export default function DayDndContext({ days, onMoveItem, children }) {
  const { t } = useTranslation();
  const { shownDays, activeItem, sensors, announcements, ...handlers } = useItemDnd({
    days,
    onMoveItem,
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      accessibility={{
        announcements,
        screenReaderInstructions: { draggable: t('planner.drag.instructions') },
      }}
      {...handlers}
    >
      {children(shownDays)}
      <DragOverlay>
        {activeItem ? (
          <DragPreview
            item={activeItem.item}
            number={activeItem.number}
            dayIndex={activeItem.dayIndex}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
