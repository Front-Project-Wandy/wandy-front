// 한 줄 요청(56)으로 마법사를 시작할 때 쓰는 날짜 계산과, 장소까지 AI가 담아 두기.
// 날짜는 'YYYY-MM-DD' 문자열이다. new Date('2026-11-10')은 UTC 자정이라 숫자로 나눠 로컬 날짜로 만든다.
const toDateString = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

const parseDate = (dateString) => {
  const [y, m, d] = dateString.split('-').map(Number);
  return new Date(y, m - 1, d);
};

// 가는 날 + 기간(일) → 오는 날. 당일치기(1일)면 가는 날과 같다.
export function getEndDate(startDate, days) {
  const date = parseDate(startDate);
  date.setDate(date.getDate() + days - 1);
  return toDateString(date);
}

export function listTripDates(startDate, endDate) {
  if (!startDate || !endDate || endDate < startDate) return [];
  const dates = [];
  const current = parseDate(startDate);
  while (toDateString(current) <= endDate) {
    dates.push(toDateString(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

// AI 빈 일정 채우기(55) 요청 조건. 새 여행이라 모든 DAY가 비어 있고 항공편도 아직 없다.
export function buildOneLineFillConditions({ country, city, style, preferredCategories, dates }) {
  return {
    country,
    city,
    style,
    preferredCategories,
    days: dates.map((date) => ({ date, itemCount: 0 })),
    excludePlaceIds: [],
    flight: null,
  };
}

// AI 결과 → 마법사 STEP5 spots 모양 [{ placeId, dayIndex }]. 한 DAY 안에서는 시각 순서 그대로다.
// 시각(startTime·stayMinutes)은 마법사 spots 계약에 칸이 없어서 지금은 넘기지 않는다 (회의 안건 3).
export const toWizardSpots = (days) =>
  days.flatMap(({ dayIndex, items }) =>
    items.map(({ place }) => ({ placeId: place.id, dayIndex })),
  );
