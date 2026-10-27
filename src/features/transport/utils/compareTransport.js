import { estimateByMode } from './estimateTransport';

// 비교 카드에 보여 줄 수단. 자차는 요구사항(택시·지하철·도보)에 없어서 뺀다.
export const COMPARE_MODES = ['walk', 'transit', 'taxi'];

// 앞 장소(from)에서 다음 장소(to)까지 수단마다 시간·비용을 계산해 나란히 돌려준다.
// fastest·cheapest는 가장 빠르거나 가장 싼 수단의 이름 목록이다 (같은 값이면 함께 들어간다).
// 모든 수단이 같은 값이면 비교할 거리가 없어서 빈 목록이다 (아주 가까운 구간은 모두 1분 등).
// 계산할 수 없으면(좌표 없음 등) null이다.
export const compareTransport = ({ from, to, country }) => {
  const options = COMPARE_MODES.map((mode) => estimateByMode({ from, to, country, mode }));
  if (options.some((option) => option === null)) return null;

  const pickBest = (key) => {
    const best = Math.min(...options.map((option) => option[key]));
    const winners = options.filter((option) => option[key] === best).map((option) => option.mode);
    return winners.length === options.length ? [] : winners;
  };
  return { options, fastest: pickBest('minutes'), cheapest: pickBest('cost') };
};
