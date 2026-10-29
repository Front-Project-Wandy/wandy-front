import { usePlanStore } from '../../store/plan/usePlanStore';
import { addDays } from '../../store/plan/planDays';
import { saveWizardTrip } from '../Wizard/summary/saveWizardTrip';

// 가는 날을 정하면 오는 날은 공개 일정의 일수로 정해진다.
export const getCopyEndDate = (trip, startDate) => addDays(startDate, trip.days.length - 1);

// 공개 일정을 내 새 여행으로 복사하고 새 여행 id를 돌려준다 (105).
// 마법사 저장(saveWizardTrip)을 그대로 써서, 지금 열린 여행이 보관함으로 가는 것까지 마법사와 똑같다.
// 항공·숙소·예산은 남의 일정에서 가져오지 않는다. 장소는 불러온 것만 넣는다(placesById에 없으면 건너뜀).
// 시각·머무는 시간·메모는 저장한 뒤 「DAY와 순서」로 맞춰 updateItem으로 붙인다.
// saveWizardTrip의 schedule은 placeId가 키라서, 같은 장소가 두 번 나오는 공개 일정이면 앞 시각이 덮이기 때문이다.
// 여러 번 바꾸는 것을 batchChanges로 묶어 되돌리기 한 단계로 남긴다 (플래너를 열면 어차피 비워진다).
export function copyPublicTrip({ trip, startDate, people, title, placesById }) {
  const draft = {
    country: trip.country,
    city: trip.city,
    startDate,
    endDate: getCopyEndDate(trip, startDate),
    people,
    style: trip.style,
    // 혼자 간 일정을 여럿이 가져오면 saveWizardTrip이 동행을 비운다 (「solo면 1명」 계약).
    companion: trip.companion,
    budget: null,
    preferredCategories: trip.categories,
    transportMode: null,
    flight: null,
    stay: null,
  };
  const dayStops = trip.days.map((day) => day.filter((stop) => placesById[stop.placeId]));
  const tripId = saveWizardTrip({
    draft,
    spots: dayStops.flatMap((stops, dayIndex) =>
      stops.map(({ placeId }) => ({ placeId, dayIndex })),
    ),
    title,
    placesById: Object.fromEntries(
      Object.entries(placesById).map(([placeId, place]) => [placeId, { place }]),
    ),
  });

  const { trip: saved, updateItem, batchChanges } = usePlanStore.getState();
  batchChanges(() => {
    saved.days.forEach((day, dayIndex) => {
      day.items.forEach((item, index) => {
        const stop = dayStops[dayIndex]?.[index];
        if (!stop) return;
        const { startTime, stayMinutes, memo } = stop;
        updateItem(
          dayIndex,
          item.id,
          memo ? { startTime, stayMinutes, memo } : { startTime, stayMinutes },
        );
      });
    });
  });

  return tripId;
}
