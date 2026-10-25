import { usePlanStore } from '../../../store/plan/usePlanStore';

// 마법사에서 고른 값을 플랜 store(C파트)에 저장하고 새 여행 id를 돌려준다.
// 다른 파트 store는 정해진 함수로만 바꾼다 (CLAUDE.md 공유 계약):
//   resetTrip → setTripInfo(날짜로 DAY를 만든다) → 장소마다 addItem(약관 형식으로 바꿔 저장한다)
// 플랜 store는 지금 여행을 하나만 저장해서, 이전 여행은 resetTrip에서 지워진다 (화면에서 미리 확인을 받는다).
// placesById: 담은 장소를 placeId로 다시 불러온 값. 찾을 수 없는 장소는 넣지 않는다.
export function saveWizardTrip({ draft, spots, title, placesById }) {
  const { resetTrip, setTripInfo, addItem } = usePlanStore.getState();

  resetTrip();
  setTripInfo({
    title,
    country: draft.country,
    city: draft.city,
    startDate: draft.startDate,
    endDate: draft.endDate,
    people: Number(draft.people),
    // null(건너뜀)은 그대로 넘긴다. 교통 계산(C)에서 혼합으로 보기로 했다.
    transportMode: draft.transportMode ?? null,
  });

  spots.forEach(({ placeId, dayIndex }) => {
    const place = placesById[placeId]?.place;
    if (place) addItem(dayIndex, place);
  });

  return usePlanStore.getState().trip.id;
}
