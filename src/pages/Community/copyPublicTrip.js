import { usePlanStore } from '../../store/plan/usePlanStore';
import { addDays } from '../../store/plan/planDays';
import { saveWizardTrip } from '../Wizard/summary/saveWizardTrip';

// 가는 날을 정하면 오는 날은 공개 일정의 일수로 정해진다.
export const getCopyEndDate = (trip, startDate) => addDays(startDate, trip.days.length - 1);

// 공개 일정을 내 새 여행으로 복사하고 새 여행 id를 돌려준다 (105).
// 마법사 저장(saveWizardTrip)을 그대로 써서, 지금 열린 여행이 보관함으로 가는 것까지 마법사와 똑같다.
// 항공·숙소·예산은 남의 일정에서 가져오지 않는다. 장소는 불러온 것만 넣는다(placesById에 없으면 건너뜀).
// 메모는 addItem이 받지 않아서 저장한 뒤 updateItem으로 붙인다. 플래너를 열 때 되돌리기 기록이 비워진다.
export function copyPublicTrip({ trip, startDate, people, title, placesById }) {
  const draft = {
    country: trip.country,
    city: trip.city,
    startDate,
    endDate: getCopyEndDate(trip, startDate),
    people,
    style: trip.style,
    companion: trip.companion,
    budget: null,
    preferredCategories: trip.categories,
    transportMode: null,
    flight: null,
    stay: null,
  };
  const stops = trip.days.flatMap((day, dayIndex) =>
    day.filter((stop) => placesById[stop.placeId]).map((stop) => ({ ...stop, dayIndex })),
  );
  const tripId = saveWizardTrip({
    draft,
    spots: stops.map(({ placeId, dayIndex }) => ({ placeId, dayIndex })),
    schedule: Object.fromEntries(
      stops.map(({ placeId, startTime, stayMinutes }) => [placeId, { startTime, stayMinutes }]),
    ),
    title,
    placesById: Object.fromEntries(
      Object.entries(placesById).map(([placeId, place]) => [placeId, { place }]),
    ),
  });

  const { trip: saved, updateItem } = usePlanStore.getState();
  saved.days.forEach((day, dayIndex) => {
    day.items.forEach((item) => {
      const memo = stops.find(
        (stop) => stop.dayIndex === dayIndex && stop.placeId === item.placeId,
      )?.memo;
      if (memo) updateItem(dayIndex, item.id, { memo });
    });
  });

  return tripId;
}
