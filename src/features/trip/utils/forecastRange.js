import { addDays } from '../../../store/plan/planDays';

// 예보 API가 주는 기간: 오늘부터 16일(오늘 포함)
export const FORECAST_DAYS = 16;

// 예보 기간은 여행지의 오늘 기준이다. 기기 시간대가 한국·일본보다 앞서면 기기의 오늘이 하루 앞서서
// end_date가 16일을 넘어 요청이 실패한다. 한국·일본은 같은 UTC+9라 한 시간대로 구한다.
const TRIP_TIME_ZONE = 'Asia/Seoul';
const getTodayInTripZone = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TRIP_TIME_ZONE }).format(new Date());

// 여행 기간 중 예보를 받을 수 있는 구간을 구한다 (58).
// - 'none': 날짜가 아직 없다
// - 'past': 여행이 이미 끝났다 → 예보가 필요 없다
// - 'tooFar': 출발이 예보 범위보다 멀다 → 예보가 열리는 날(availableFrom)과 함께 안내만 보여 준다
// - 'ok': start~end가 예보를 받을 구간 (여행 중이면 start는 오늘, 일부만 먼 날이면 end가 잘린다)
export function getForecastRange({ startDate, endDate, today = getTodayInTripZone() }) {
  if (!startDate || !endDate) return { status: 'none' };
  const lastDate = addDays(today, FORECAST_DAYS - 1);
  if (endDate < today) return { status: 'past' };
  if (startDate > lastDate) {
    return { status: 'tooFar', availableFrom: addDays(startDate, -(FORECAST_DAYS - 1)) };
  }
  return {
    status: 'ok',
    start: startDate < today ? today : startDate,
    end: endDate > lastDate ? lastDate : endDate,
  };
}
