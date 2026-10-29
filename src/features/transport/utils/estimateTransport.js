import {
  CAR,
  COST_ROUND_UNIT,
  FARES,
  ROUTE_FACTOR,
  SPEED_KMH,
  WALK_MAX_METERS,
} from '../constants';
import { estimateCarCost } from './estimateCarCost';
import { getDistanceMeters } from './distance';
import { getDepartureMinutes, getNightSurchargeRate } from './nightSurcharge';

const hasCoords = (place) => Number.isFinite(place?.lat) && Number.isFinite(place?.lng);

// 마법사에서 정하지 않았거나 '혼합'이면 걸을 만하면 걷고, 아니면 대중교통으로 본다
const pickMode = (distanceMeters, transportMode) => {
  if (distanceMeters <= WALK_MAX_METERS) return 'walk';
  return transportMode && transportMode !== 'mixed' ? transportMode : 'transit';
};

const roundCost = (cost) => Math.round(cost / COST_ROUND_UNIT) * COST_ROUND_UNIT;

// 수단(mode)을 정해 두고 앞 장소(from)에서 다음 장소(to)까지의 시간(분)·비용을 추정한다.
// 비교 카드가 수단마다 계산할 때 쓰고, estimateTransport도 고른 수단으로 이걸 부른다.
// speedKmh를 주면 그 속도로 시간을 구한다(공항 이동처럼 도심 기준 속도가 맞지 않을 때).
// 택시는 출발 시각(from의 startTime + stayMinutes)에 따라 심야 할증이 붙는다. 시각이 없으면 할증 없이 계산한다.
// 자차는 유류비(fuelCost)와 통행료(tollCost)로 나눠 구하고 cost는 둘의 합이다. 고속도로로 보는 구간은 속도도 빠르다 (#59).
// 좌표가 없거나 나라·수단을 모르면 계산할 수 없어서 null을 돌려준다.
export const estimateByMode = ({ from, to, country, mode, speedKmh }) => {
  if (!hasCoords(from) || !hasCoords(to) || !FARES[country] || !SPEED_KMH[mode]) return null;

  const routeMeters = getDistanceMeters(from, to) * ROUTE_FACTOR;
  const carCost = mode === 'car' ? estimateCarCost({ routeMeters, country }) : null;
  const defaultSpeed = carCost?.isHighway ? CAR.HIGHWAY_SPEED_KMH : SPEED_KMH[mode];
  const minutes = Math.max(1, Math.ceil((routeMeters / 1000 / (speedKmh ?? defaultSpeed)) * 60));
  if (carCost) {
    // 내역과 합계가 어긋나지 않게 각각 반올림한 값을 더해 cost로 쓴다
    const fuelCost = roundCost(carCost.fuel);
    const tollCost = roundCost(carCost.toll);
    return { mode, minutes, cost: fuelCost + tollCost, fuelCost, tollCost, nightSurcharge: 0 };
  }
  const fare = FARES[country][mode];
  const nightSurcharge =
    mode === 'taxi' ? getNightSurchargeRate(country, getDepartureMinutes(from)) : 0;
  const cost = fare
    ? roundCost((fare.base + (routeMeters / 1000) * fare.perKm) * (1 + nightSurcharge))
    : 0;

  return { mode, minutes, cost, nightSurcharge };
};

// 앞 장소(from)에서 다음 장소(to)까지의 이동 수단·시간(분)·비용을 추정해
// 플랜 item의 transportToNext 모양({ mode, minutes, cost })에 nightSurcharge를 더해 돌려준다.
// nightSurcharge는 택시 심야 할증률(0.2 = 20%)이고, 해당하지 않으면 0이다.
// 좌표가 없거나 나라를 모르면 계산할 수 없어서 null을 돌려준다.
export const estimateTransport = ({ from, to, country, transportMode = null }) => {
  if (!hasCoords(from) || !hasCoords(to)) return null;

  const mode = pickMode(getDistanceMeters(from, to), transportMode);
  return estimateByMode({ from, to, country, mode });
};
