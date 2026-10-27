import {
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  findItemPosition,
  parseDayDropId,
  previewCrossDayMove,
  settleDrop,
} from '../utils/dragPosition';

// 이만큼 움직이기 전에는 끌기로 보지 않는다 (손잡이를 눌렀다 떼는 것과 구분하려고)
const DRAG_START_DISTANCE = 6;

// 장소 위를 먼저 본다. DAY 칸은 그 안의 장소를 감싸고 있어서 늘 같이 걸리기 때문이다.
// 마우스·터치는 포인터가 놓인 칸만 쓴다. 지도 쪽 같은 칸 밖에 놓으면 빈 결과를 돌려줘서 취소되게 한다.
// 키보드로 끌 때는 포인터가 없어서 겹치는 칸, 그것도 없으면 가장 가까운 칸을 쓴다.
export const collisionDetection = (args) => {
  const hits = args.pointerCoordinates ? pointerWithin(args) : rectIntersection(args);
  const itemHits = hits.filter(({ id }) => parseDayDropId(id) === null);
  if (itemHits.length > 0) return itemHits;
  if (hits.length > 0) return hits;
  return args.pointerCoordinates ? [] : closestCenter(args);
};

// 끌고 있는 카드의 가운데가 놓일 자리(over)의 가운데보다 아래면 true. 다른 DAY의 장소 위에 넣을 때 앞/뒤를 정한다.
const isBelowOver = (active, over) => {
  const moved = active.rect.current.translated;
  return Boolean(moved) && moved.top + moved.height / 2 > over.rect.top + over.rect.height / 2;
};

// 장소를 끌어 순서를 바꾸는 동작을 관리한다 (16).
// 끄는 동안은 store를 건드리지 않고 화면용 draft만 바꿔서 자리가 벌어지는 모습을 보여 주고,
// 놓을 때 한 번만 onMoveItem(from, to)를 부른다. 놓을 곳이 없거나 취소하면 아무것도 바뀌지 않는다.
export function useItemDnd({ days, onMoveItem }) {
  const { t } = useTranslation();
  const [draftDays, setDraftDays] = useState(null);
  const [activeId, setActiveId] = useState(null);
  // 이벤트 핸들러가 항상 가장 새 값을 보도록 ref에도 둔다
  const startDaysRef = useRef(null);
  const draftRef = useRef(null);
  const settledRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: DRAG_START_DISTANCE } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const shownDays = draftDays ?? days;
  const activePosition = activeId ? findItemPosition(shownDays, activeId) : null;
  const activeItem = activePosition
    ? {
        item: shownDays[activePosition.dayIndex].items[activePosition.index],
        number: activePosition.index + 1,
        dayIndex: activePosition.dayIndex,
      }
    : null;

  const updateDraft = (next) => {
    draftRef.current = next;
    setDraftDays(next);
  };
  const reset = () => {
    startDaysRef.current = null;
    draftRef.current = null;
    setDraftDays(null);
    setActiveId(null);
  };

  const handleDragStart = ({ active }) => {
    startDaysRef.current = days;
    settledRef.current = null;
    updateDraft(days);
    setActiveId(active.id);
  };

  const handleDragOver = ({ active, over }) => {
    if (!over || !draftRef.current) return;
    const next = previewCrossDayMove(
      draftRef.current,
      active.id,
      over.id,
      isBelowOver(active, over),
    );
    if (next) updateDraft(next);
  };

  const handleDragEnd = ({ active, over }) => {
    const start = startDaysRef.current;
    const settled =
      over && draftRef.current
        ? settleDrop(draftRef.current, active.id, over.id, isBelowOver(active, over))
        : null;
    settledRef.current = settled;
    reset();
    if (!start || !settled) return;

    const from = findItemPosition(start, active.id);
    const to = findItemPosition(settled, active.id);
    if (from && to && (from.dayIndex !== to.dayIndex || from.index !== to.index)) {
      onMoveItem(from, to);
    }
  };

  // 낭독기가 읽는 안내. 구글 장소는 이름을 저장하지 않아서 이름 대신 "DAY 2의 3번째"처럼 자리로 말한다.
  const describe = (id, list) => {
    const dayIndex = parseDayDropId(id);
    if (dayIndex !== null) return t('planner.drag.dayEnd', { day: dayIndex + 1 });
    const position = findItemPosition(list, id);
    return position
      ? t('planner.drag.position', { day: position.dayIndex + 1, number: position.index + 1 })
      : '';
  };
  const currentDays = () => draftRef.current ?? settledRef.current ?? days;
  const announcements = {
    onDragStart: ({ active }) => t('planner.drag.start', { position: describe(active.id, days) }),
    onDragOver: ({ over }) =>
      over ? t('planner.drag.over', { position: describe(over.id, currentDays()) }) : undefined,
    onDragEnd: ({ active, over }) =>
      over
        ? t('planner.drag.end', { position: describe(active.id, currentDays()) })
        : t('planner.drag.cancel'),
    onDragCancel: () => t('planner.drag.cancel'),
  };

  return {
    shownDays,
    activeItem,
    sensors,
    announcements,
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDragEnd: handleDragEnd,
    onDragCancel: reset,
  };
}
