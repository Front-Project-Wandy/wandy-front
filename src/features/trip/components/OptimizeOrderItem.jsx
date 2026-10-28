import { useItemName } from '../hooks/useItemName';
import NumberBadge from './NumberBadge';

// 동선 최적화 창의 새 순서에서 장소 한 줄 (번호 원 + 이름). 구글 장소는 이름을 저장하지 않아서 useItemName으로 불러온다.
export default function OptimizeOrderItem({ item, number, dayIndex }) {
  const name = useItemName(item);

  return (
    <li className="flex items-center gap-3">
      <NumberBadge number={number} dayIndex={dayIndex} />
      <span className="min-w-0 flex-1 truncate text-body">{name}</span>
    </li>
  );
}
