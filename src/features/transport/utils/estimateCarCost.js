import { CAR } from '../constants';

// 렌터카로 routeMeters(보정한 도로 거리)를 갈 때의 유류비·통행료 추정 (요구사항 #59). 반올림하지 않은 값이다.
// 고속도로로 보는 구간(isHighway)은 통행료가 붙고, 시내 구간은 유류비만 든다.
// 나라를 모르면 계산할 수 없어서 null이다.
export const estimateCarCost = ({ routeMeters, country }) => {
  const car = CAR[country];
  if (!car) return null;

  const km = routeMeters / 1000;
  const isHighway = routeMeters >= CAR.HIGHWAY_MIN_METERS;
  return {
    fuel: (km / car.kmPerLiter) * car.fuelPricePerLiter,
    toll: isHighway ? car.toll.base + km * car.toll.perKm : 0,
    isHighway,
  };
};
