import { useState } from 'react';
import { readVisitedIds, writeVisitedIds } from '../utils/visitedItems';

// 「다녀옴」 체크 상태 (요구사항 #93). 1단계라 서버가 없어서 여행별로 localStorage에 둔다.
// plan store의 item 계약을 바꾸지 않으려고 따로 두었고, 2단계에서 서버 저장으로 옮긴다.
// 여행이 바뀌면 컴포넌트를 새로 만들어(key=tripId) 그 여행의 값을 다시 읽게 한다.
export function useVisitedItems(tripId) {
  const [visitedIds, setVisitedIds] = useState(() => readVisitedIds(tripId));

  const toggle = (itemId) => {
    const next = visitedIds.includes(itemId)
      ? visitedIds.filter((id) => id !== itemId)
      : [...visitedIds, itemId];
    setVisitedIds(next);
    writeVisitedIds(tripId, next);
  };

  return { visitedIds, toggle };
}
