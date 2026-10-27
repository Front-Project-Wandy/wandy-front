import { useMemo } from 'react';
import { buildStayPoint } from '../utils/buildStayPoint';

// 체크인 날짜처럼 지도와 상관없는 값이 바뀌어도 stay 객체는 새로 만들어진다.
// 그대로 쓰면 그때마다 마커를 지웠다 다시 그리고 지도가 다시 맞춰져서, 내용이 같으면 같은 값을 돌려준다.
export function useStayPoint(stay) {
  const key = JSON.stringify(buildStayPoint(stay));
  return useMemo(() => JSON.parse(key), [key]);
}
