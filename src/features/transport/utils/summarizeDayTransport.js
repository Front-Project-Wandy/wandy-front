import { estimateTransport } from './estimateTransport';

// 한 DAY의 이동 합계. 연속한 장소 쌍마다 구간 줄과 같은 estimateTransport로 계산해서 더하므로,
// 화면의 구간 줄 값을 더한 것과 항상 같다. 좌표가 없어 계산할 수 없는 구간은 구간 줄에서도 빠져서 합계에서도 뺀다.
// 계산된 구간이 하나도 없으면 null이다 (장소가 1곳 이하이거나 좌표가 없는 경우).
export const summarizeDayTransport = ({ items, country, transportMode }) => {
  const legs = items
    .slice(0, -1)
    .map((item, index) =>
      estimateTransport({ from: item, to: items[index + 1], country, transportMode }),
    )
    .filter(Boolean);
  if (legs.length === 0) return null;

  return {
    minutes: legs.reduce((sum, leg) => sum + leg.minutes, 0),
    cost: legs.reduce((sum, leg) => sum + leg.cost, 0),
    legCount: legs.length,
  };
};
