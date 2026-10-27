import { usePlanStore } from '../../../store/plan/usePlanStore';
import { toPlanFlight } from '../flight/flightOptions';
import { toPlanStay } from '../stay/stayOptions';

// 마법사에서 고른 값을 플랜 store(C파트)에 저장하고 새 여행 id를 돌려준다.
// 다른 파트 store는 정해진 함수로만 바꾼다 (CLAUDE.md 공유 계약):
//   startNewTrip → setTripInfo(날짜로 DAY를 만든다) → setFlight·setStay(있을 때) → 장소마다 addItem
// startNewTrip은 지금 열린 여행을 보관함(trips)으로 보낸다. 이전 여행은 지워지지 않고 내 여행 목록에 남는다 (#59).
// placesById: 담은 장소를 placeId로 다시 불러온 값. 찾을 수 없는 장소는 넣지 않는다.
export function saveWizardTrip({ draft, spots, title, placesById }) {
  const { startNewTrip, setTripInfo, setFlight, setStay, addItem } = usePlanStore.getState();

  startNewTrip();
  setTripInfo({
    title,
    country: draft.country,
    city: draft.city,
    startDate: draft.startDate,
    endDate: draft.endDate,
    people: Number(draft.people),
    // 동행·예산은 플랜 계약에 모양이 정해지면 넘긴다 (지금은 마법사 draft에만 있다).
    style: draft.style,
    // null(건너뜀)은 그대로 넘긴다. 교통 계산(C)에서 혼합으로 보기로 했다.
    transportMode: draft.transportMode ?? null,
  });

  const flight = toPlanFlight(draft.flight, draft);
  if (flight) setFlight(flight);
  const stay = toPlanStay(draft.stay, draft);
  if (stay) setStay(stay);

  spots.forEach(({ placeId, dayIndex }) => {
    const place = placesById[placeId]?.place;
    if (place) addItem(dayIndex, place);
  });

  return usePlanStore.getState().trip.id;
}
