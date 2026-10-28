import { AIRPORT_SPEED_KMH, AIRPORTS, DEFAULT_AIRPORT } from '../constants';
import { estimateByMode } from './estimateTransport';

const hasCoords = (place) => Number.isFinite(place?.lat) && Number.isFinite(place?.lng);

// 도착한 공항에서 숙소까지의 이동 시간·요금 추정 (요구사항 #52). 도착 공항(flight.arriveAirport)을 알면 그 공항,
// 모르면(직접 입력 등) 여행 도시의 대표 공항으로 계산하고 isAssumed가 true다.
// 항공 정보나 좌표 있는 숙소가 없거나 공항·나라를 알 수 없으면 null이다.
// 수단은 마법사에서 고른 교통 방식이 택시·자차면 그대로, 아니면(대중교통·혼합·건너뜀) 대중교통이다. 공항 이동은 걸어가지 않는다.
// 도착 시각(arriveAt)으로 택시 심야 할증도 반영한다.
export const estimateAirportLeg = ({ flight, stay, city, country, transportMode }) => {
  if (!flight || !hasCoords(stay)) return null;

  const airportCode =
    flight.arriveAirport in AIRPORTS ? flight.arriveAirport : DEFAULT_AIRPORT[city];
  const airport = AIRPORTS[airportCode];
  if (!airport) return null;

  const mode = ['taxi', 'car'].includes(transportMode) ? transportMode : 'transit';
  const arriveTime = flight.arriveAt?.slice(11, 16);
  const leg = estimateByMode({
    from: { ...airport, startTime: arriveTime, stayMinutes: 0 },
    to: stay,
    country,
    mode,
    speedKmh: AIRPORT_SPEED_KMH[mode],
  });
  if (!leg) return null;

  return { ...leg, airportCode, isAssumed: airportCode !== flight.arriveAirport };
};
