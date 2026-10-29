import { estimateTransport } from '../../transport/utils/estimateTransport';
import { COUNTRY_CURRENCY, ENTRY_FEE, MEAL_COST, TOTAL_ROUND_UNIT } from '../constants';

const sum = (numbers) => numbers.reduce((total, value) => total + value, 0);

// 택시·자차는 차량 한 대 요금이라 인원이 늘어도 그대로고, 대중교통·도보는 한 사람 요금이라 인원만큼 곱한다.
const SHARED_VEHICLE_MODES = ['taxi', 'car'];

// 여행 전체의 예상 비용 (요구사항 #57): 교통 + 입장료 + 식비. 항공·숙소는 넣지 않는다.
// 교통은 구간 줄과 같은 estimateTransport로 구하므로 DAY별 합계(39)·구간 값과 이어진다. 자차는 유류비(fuel)·통행료(toll)로 나눠 센다 (#59).
// 입장료·식비는 카테고리별 1인 평균 추정치 × 인원. 금액은 여행 나라 통화 기준이다.
// 나라를 모르거나 일정에 장소가 없으면 보여 줄 게 없어서 null이다.
export const summarizeTripCost = (trip) => {
  const currency = COUNTRY_CURRENCY[trip?.country];
  const items = trip?.days?.flatMap((day) => day.items) ?? [];
  if (!currency || items.length === 0) return null;

  const people = Number.isInteger(trip.people) && trip.people > 0 ? trip.people : 1;
  const entryFees = ENTRY_FEE[trip.country];
  const mealCosts = MEAL_COST[trip.country];

  const legs = trip.days.flatMap((day) =>
    day.items.slice(0, -1).map((item, index) =>
      estimateTransport({
        from: item,
        to: day.items[index + 1],
        country: trip.country,
        transportMode: trip.transportMode,
      }),
    ),
  );
  // 자차는 유류비·통행료로 나눠 보여 주려고(#59) 교통에서 따로 센다
  const carLegs = legs.filter((leg) => leg?.mode === 'car');
  const fuel = sum(carLegs.map((leg) => leg.fuelCost));
  const toll = sum(carLegs.map((leg) => leg.tollCost));
  const transport = sum(
    legs
      .filter((leg) => leg && leg.mode !== 'car')
      .map((leg) => (SHARED_VEHICLE_MODES.includes(leg.mode) ? leg.cost : leg.cost * people)),
  );
  const entry = sum(items.map((item) => (entryFees[item.myCategory] ?? 0) * people));
  const meals = sum(items.map((item) => (mealCosts[item.myCategory] ?? 0) * people));

  const total = transport + fuel + toll + entry + meals;
  const perPerson = Math.round(total / people / TOTAL_ROUND_UNIT) * TOTAL_ROUND_UNIT;
  return { currency, people, transport, fuel, toll, entry, meals, total, perPerson };
};
