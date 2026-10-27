import { useMemo } from 'react';
import { usePlanStore } from './usePlanStore';

// 지금 여는 여행과 보관함의 여행을 합친 목록 (내 여행·홈 D-day 카드 같은 곳에서 쓴다).
// selector 안에서 새 배열을 만들면 매번 값이 달라져 무한 재렌더가 나서, 두 값을 따로 읽어 useMemo로 합친다.
export function useAllTrips() {
  const trip = usePlanStore((state) => state.trip);
  const trips = usePlanStore((state) => state.trips);
  return useMemo(() => (trip ? [trip, ...trips] : trips), [trip, trips]);
}
