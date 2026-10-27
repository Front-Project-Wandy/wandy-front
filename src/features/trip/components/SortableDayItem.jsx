import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// DAY 목록의 장소 하나를 끌 수 있게 감싼다 (16). children은 손잡이용 props를 받아 그리는 함수다.
export default function SortableDayItem({ id, children }) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, transition: prefersReducedMotion ? null : undefined });

  // 인라인 style은 쓰지 않는 게 팀 규칙이지만 이번 한 번만 예외로 둔다 (회의에서 승인).
  // 끄는 동안 위치(transform)가 계속 바뀌어서 Tailwind 클래스로는 만들 수 없다. 다른 곳에는 쓰지 않는다.
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <li ref={setNodeRef} style={style} className={`space-y-2 ${isDragging ? 'opacity-40' : ''}`}>
      {children({ ref: setActivatorNodeRef, ...attributes, ...listeners })}
    </li>
  );
}
