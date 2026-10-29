// 대화형 여행 비서(101)에게 넘기는 지금 여행 요약.
// 장소는 ref('DAY-순서', 예: '2-3')로 가리키게 해서 AI가 id를 지어내지 않게 하고, 받은 ref는 findItemByRef로 되돌린다.
// 구글 장소 이름은 저장하지 않는 규칙이라(약관) 화면에서 placeId로 불러온 이름(itemNames)을 이때만 넣는다.

// 추가 후보는 너무 많으면 요청이 길어져서 앞에서부터 이만큼만 보낸다
const MAX_CANDIDATES = 60;

const toRef = (dayIndex, index) => `${dayIndex + 1}-${index + 1}`;

export const buildAssistantContext = ({ trip, itemNames, candidates, cost }) => {
  const plannedIds = new Set(trip.days.flatMap((day) => day.items.map((item) => item.placeId)));
  return {
    title: trip.title ?? null,
    country: trip.country,
    city: trip.city,
    startDate: trip.startDate,
    endDate: trip.endDate,
    people: trip.people,
    style: trip.style,
    transportMode: trip.transportMode ?? null,
    estimatedCost: cost ? { total: cost.total, currency: cost.currency } : null,
    days: trip.days.map((day, dayIndex) => ({
      day: dayIndex + 1,
      date: day.date,
      items: day.items.map((item, index) => ({
        ref: toRef(dayIndex, index),
        name: itemNames[item.id] ?? null,
        category: item.myCategory,
        startTime: item.startTime,
        stayMinutes: item.stayMinutes,
      })),
    })),
    // 이미 일정에 있는 곳은 빼서, 추가할 수 있는 곳만 알려 준다
    candidatePlaces: candidates
      .filter((place) => !plannedIds.has(place.id))
      .slice(0, MAX_CANDIDATES)
      .map((place) => ({ name: place.name, category: place.category })),
  };
};

// 'DAY-순서' ref → { dayIndex, index, item } (없으면 null)
export const findItemByRef = (trip, ref) => {
  const match = /^(\d+)-(\d+)$/.exec(typeof ref === 'string' ? ref.trim() : '');
  if (!match) return null;
  const dayIndex = Number(match[1]) - 1;
  const index = Number(match[2]) - 1;
  const item = trip.days[dayIndex]?.items[index];
  return item ? { dayIndex, index, item } : null;
};
