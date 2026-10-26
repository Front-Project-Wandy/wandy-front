import { COST_ROUND_UNIT, FARES, ROUTE_FACTOR, SPEED_KMH, WALK_MAX_METERS } from '../constants';
import { getDistanceMeters } from './distance';

const hasCoords = (place) => Number.isFinite(place?.lat) && Number.isFinite(place?.lng);

// 마법사에서 정하지 않았거나 '혼합'이면 걸을 만하면 걷고, 아니면 대중교통으로 본다
const pickMode = (distanceMeters, transportMode) => {
  if (distanceMeters <= WALK_MAX_METERS) return 'walk';
  return transportMode && transportMode !== 'mixed' ? transportMode : 'transit';
};

const roundCost = (cost) => Math.round(cost / COST_ROUND_UNIT) * COST_ROUND_UNIT;

// 앞 장소(from)에서 다음 장소(to)까지의 이동 수단·시간(분)·비용을 추정해
// 플랜 item의 transportToNext 모양({ mode, minutes, cost })으로 돌려준다.
// 좌표가 없거나 나라를 모르면 계산할 수 없어서 null을 돌려준다.
export const estimateTransport = ({ from, to, country, transportMode = null }) => {
  if (!hasCoords(from) || !hasCoords(to) || !FARES[country]) return null;

  const routeMeters = getDistanceMeters(from, to) * ROUTE_FACTOR;
  const mode = pickMode(routeMeters / ROUTE_FACTOR, transportMode);
  const minutes = Math.max(1, Math.ceil((routeMeters / 1000 / SPEED_KMH[mode]) * 60));
  const fare = FARES[country][mode];
  const cost = fare ? roundCost(fare.base + (routeMeters / 1000) * fare.perKm) : 0;

  return { mode, minutes, cost };
};
