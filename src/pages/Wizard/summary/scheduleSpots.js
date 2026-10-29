// 담은 장소마다 시작 시각·머무는 시간을 정한다 (48 항공 일정 반영, 51 체크인·체크아웃 반영).
// AI 채우기가 정한 시각을 담아 두지 않고 저장할 때 한 번에 계산한다. AI로 채운 뒤 순서를 바꾸거나
// 장소를 더해도 시각이 어긋나지 않게 하려고. 규칙은 AI 채우기(buildMockItinerary)와 같은 값을 쓴다.
//   첫날: 도착 시각 + 여유 시간 이후, 30분 단위로 올림
//   마지막 날: 체크아웃 시각 이후에 시작, 출발 시각 - 여유 시간 전까지
//   장소 사이: 머무는 시간(여행 스타일) + 이동 30분
// 마지막 날 장소가 출발 전까지 다 들어가지 않아도 지우지 않는다. 고른 건 사용자라서
// 플래너의 항공 시간 경고(getFlightTimeWarnings)로 보여 주고 고치게 한다.

const DAY_START = 10 * 60;
const MOVE_MINUTES = 30;
const ARRIVAL_BUFFER = 120;
const DEPARTURE_BUFFER = 180;
// 23:30보다 늦게 시작하면 'HH:mm'으로 쓸 수 없어서(24:00 이상) 여기서 멈춘다.
const LATEST_START = 23 * 60 + 30;
const STAY_MINUTES = { relaxed: 120, normal: 90, packed: 60 };

const toMinutes = (time) => {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time ?? '');
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
};

const toTime = (minutes) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

const roundUpToHalfHour = (minutes) => Math.ceil(minutes / 30) * 30;

// 그 DAY 첫 장소를 시작하는 시각(분). 당일치기는 첫날이자 마지막 날이라 둘 다 본다.
// 당일치기에는 숙소에서 묵지 않으니 체크아웃은 보지 않는다.
function getDayStart(dayIndex, { lastDayIndex, arrive, checkOut }) {
  let start = DAY_START;
  if (dayIndex === 0 && arrive !== null) {
    start = Math.max(start, roundUpToHalfHour(arrive + ARRIVAL_BUFFER));
  }
  if (dayIndex === lastDayIndex && lastDayIndex > 0 && checkOut !== null) {
    start = Math.max(start, checkOut);
  }
  return start;
}

// spots: [{ placeId, dayIndex }] (DAY 안 순서 = 배열 순서), dayCount: 여행 일수
// flight·stay: 마법사 draft.flight·draft.stay (고르지 않았으면 null)
// 돌려주는 값: { [placeId]: { startTime: 'HH:mm', stayMinutes } }
export function scheduleSpots({ spots, dayCount, flight, stay, style }) {
  const stayMinutes = STAY_MINUTES[style] ?? STAY_MINUTES.normal;
  const hasFlight = Boolean(flight?.status);
  const context = {
    lastDayIndex: dayCount - 1,
    arrive: hasFlight ? toMinutes(flight.arriveTime) : null,
    checkOut: stay?.status ? toMinutes(stay.checkOutTime) : null,
  };
  const depart = hasFlight ? toMinutes(flight.departTime) : null;

  const schedule = {};
  for (let dayIndex = 0; dayIndex < dayCount; dayIndex += 1) {
    let time = getDayStart(dayIndex, context);
    spots
      .filter((spot) => spot.dayIndex === dayIndex)
      .forEach(({ placeId }) => {
        schedule[placeId] = { startTime: toTime(Math.min(time, LATEST_START)), stayMinutes };
        time += stayMinutes + MOVE_MINUTES;
      });
  }
  return { schedule, departLimit: depart === null ? null : depart - DEPARTURE_BUFFER };
}

// 마지막 날 일정이 출발 여유 시간을 넘기는지. STEP7에서 저장 전에 알려 주는 데 쓴다.
export function isPastDepartLimit({ startTime, stayMinutes }, departLimit) {
  return departLimit !== null && toMinutes(startTime) + stayMinutes > departLimit;
}
