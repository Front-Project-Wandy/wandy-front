// 항공편 시각은 'YYYY-MM-DDTHH:mm'(여행 첫날 도착·마지막 날 출발)이라 날짜와 시각을 나눠 쓴다.
const splitDateTime = (value) => (value ? [value.slice(0, 10), value.slice(11, 16)] : [null, null]);

const toMinutes = (time) => {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
};

// 일정이 비행기 시간과 어긋나는지 알려 준다. 막지 않고 알려 주기만 한다(순서 경고와 같은 방식).
// 반환: [{ type: 'beforeArrival' | 'afterDeparture', time: 'HH:mm' }], 문제가 없으면 빈 배열.
export const getFlightTimeWarnings = ({ flight, date, item }) => {
  if (!flight) return [];

  const warnings = [];
  const [arriveDate, arriveTime] = splitDateTime(flight.arriveAt);
  const [departDate, departTime] = splitDateTime(flight.departAt);

  // 도착한 날은 도착 시각 전에 시작하는 일정이 있을 수 없다
  if (arriveDate === date && item.startTime < arriveTime) {
    warnings.push({ type: 'beforeArrival', time: arriveTime });
  }

  // 출발하는 날은 일정이 끝나는 시각(시작 + 체류)이 출발 시각을 넘으면 안 된다
  if (departDate === date && toMinutes(item.startTime) + item.stayMinutes > toMinutes(departTime)) {
    warnings.push({ type: 'afterDeparture', time: departTime });
  }

  return warnings;
};
