import passData from '../../../mocks/transportPasses.json';
import { estimateTransport } from './estimateTransport';

export const PASS_PRICES_CHECKED_AT = passData.checkedAt;

// 그날 대중교통 구간의 추정 요금(1인) 합계. 택시·자차·도보 구간은 패스로 줄일 수 없어서 뺀다.
const getDayTransitCost = (day, country, transportMode) =>
  day.items.slice(0, -1).reduce((sum, item, index) => {
    const leg = estimateTransport({ from: item, to: day.items[index + 1], country, transportMode });
    return leg?.mode === 'transit' ? sum + leg.cost : sum;
  }, 0);

// 패스 기간(days일)만큼 이어진 DAY 구간을 한 칸씩 밀면서, 대중교통 요금을 가장 많이 덜어 주는 구간을 찾는다.
// 패스가 여행보다 길면 여행 전체가 구간이다.
const findBestWindow = (dayCosts, passDays) => {
  const windowSize = Math.min(passDays, dayCosts.length);
  let best = { startDay: 0, endDay: windowSize - 1, coveredCost: -1 };
  for (let start = 0; start + windowSize <= dayCosts.length; start += 1) {
    const coveredCost = dayCosts.slice(start, start + windowSize).reduce((a, b) => a + b, 0);
    if (coveredCost > best.coveredCost) {
      best = { startDay: start, endDay: start + windowSize - 1, coveredCost };
    }
  }
  return best;
};

// 교통패스가 이득인지 계산한다 (요구사항 #76). 금액은 모두 1인 기준, 여행 나라 통화다.
// 여행에 대중교통 구간이 하나도 없으면(택시·자차 위주, 장소 1곳 등) 비교할 게 없어서 null이다.
// 돌려주는 값: options(이득이 큰 순서) = [{ pass, startDay, endDay, coveredCost, benefit }] (DAY 번호는 0부터),
// best = 이득이 나는 가장 좋은 패스(없으면 null).
// 여행보다 긴 패스는 버리고, 하루짜리는 항상 비교한다. 요금은 추정치라서 이득이 부풀려질 수 있다.
export const evaluatePasses = (trip, passes = passData.passes) => {
  const { country, transportMode } = trip ?? {};
  const days = trip?.days ?? [];
  const dayCosts = days.map((day) => getDayTransitCost(day, country, transportMode));
  if (dayCosts.every((cost) => cost === 0)) return null;

  const options = passes
    .filter((pass) => pass.country === country && (pass.days <= days.length || pass.days === 1))
    .map((pass) => {
      const window = findBestWindow(dayCosts, pass.days);
      return { pass, ...window, benefit: window.coveredCost - pass.price };
    })
    .sort((a, b) => b.benefit - a.benefit);
  if (options.length === 0) return null;

  return { options, best: options[0].benefit > 0 ? options[0] : null };
};
