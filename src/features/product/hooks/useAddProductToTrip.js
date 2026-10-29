import { useCallback } from 'react';
import { usePlanStore } from '../../../store/plan/usePlanStore';
import { buildProductItemOptions, toProductPlace } from '../utils/productPlanItem';

// 상품을 여행의 한 DAY 끝에 넣는다 (84). 플랜 store 함수(selectTrip·addItem)로만 바꾼다.
// addItem은 지금 여는 여행에만 넣을 수 있어서, 보관함 여행이면 먼저 그 여행을 연다(selectTrip).
// 플래너에서 넣으면 addItem이 되돌리기 한 단계로 남는다. 넣었으면 true.
export function useAddProductToTrip() {
  return useCallback(({ tripId, dayIndex, product }) => {
    const { trip, selectTrip } = usePlanStore.getState();
    if (trip?.id !== tripId) selectTrip(tripId);

    const { trip: current, addItem } = usePlanStore.getState();
    const items = current?.id === tripId ? current.days[dayIndex]?.items : null;
    if (!items) return false;

    addItem(dayIndex, toProductPlace(product), buildProductItemOptions(product, items));
    return true;
  }, []);
}
