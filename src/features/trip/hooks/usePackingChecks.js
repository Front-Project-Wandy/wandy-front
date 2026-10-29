import { useState } from 'react';
import { readPrepChecks, writePrepChecks } from '../utils/prepChecks';

// 준비물 체크 상태 (요구사항 #92). 1단계라 서버가 없어서 여행별로 localStorage에 둔다.
// 여행이 바뀌면 컴포넌트를 새로 만들어(key=tripId) 그 여행의 값을 다시 읽게 한다.
export function usePackingChecks(tripId) {
  const [checkedIds, setCheckedIds] = useState(() => readPrepChecks(tripId));

  const update = (next) => {
    setCheckedIds(next);
    writePrepChecks(tripId, next);
  };

  const toggle = (itemId) =>
    update(
      checkedIds.includes(itemId)
        ? checkedIds.filter((id) => id !== itemId)
        : [...checkedIds, itemId],
    );

  return { checkedIds, toggle, clear: () => update([]) };
}
