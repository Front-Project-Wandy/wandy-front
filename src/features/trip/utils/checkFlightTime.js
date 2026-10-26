// 항공편 시각은 'YYYY-MM-DDTHH:mm'(여행 첫날 도착·마지막 날 출발)이다.
// 자정을 넘기는 일정도 비교할 수 있도록 날짜와 시각을 합친 "분" 값으로 바꿔서 견준다.
// UTC로 계산하면 서머타임 같은 시간대 영향 없이 분 단위 차이만 남는다.
const toEpochMinutes = (date, time) => {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  return Date.UTC(year, month - 1, day, hour, minute) / 60000;
};

const parseFlightTime = (value) =>
  value
    ? {
        minutes: toEpochMinutes(value.slice(0, 10), value.slice(11, 16)),
        time: value.slice(11, 16),
      }
    : null;

// 일정이 비행기 시간과 어긋나는지 알려 준다. 막지 않고 알려 주기만 한다(순서 경고와 같은 방식).
// 반환: [{ type: 'beforeArrival' | 'afterDeparture', time: 'HH:mm' }], 문제가 없으면 빈 배열.
export const getFlightTimeWarnings = ({ flight, date, item }) => {
  if (!flight) return [];

  const warnings = [];
  const start = toEpochMinutes(date, item.startTime);
  const end = start + item.stayMinutes;
  const arrive = parseFlightTime(flight.arriveAt);
  const depart = parseFlightTime(flight.departAt);

  // 도착하기 전에 시작하는 일정은 있을 수 없다
  if (arrive && start < arrive.minutes) {
    warnings.push({ type: 'beforeArrival', time: arrive.time });
  }

  // 일정이 끝나는 일시(시작 + 체류)가 출발 일시를 넘으면 안 된다. 자정을 넘기는 일정도 걸러진다.
  if (depart && end > depart.minutes) {
    warnings.push({ type: 'afterDeparture', time: depart.time });
  }

  return warnings;
};
