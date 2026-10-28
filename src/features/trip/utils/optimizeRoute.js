import { getDistanceMeters } from '../../transport/utils/distance';

// 장소가 이 수 이하면 모든 경우를 따져 가장 짧은 순서를 정확히 구하고(2^n × n²), 넘으면 근사로 푼다.
const EXACT_LIMIT = 12;
// 이 거리(m)보다 적게 줄어드는 건 계산 오차로 보고 「이미 가장 짧다」고 본다.
const MIN_GAIN_METERS = 1;

const hasCoords = (item) => Number.isFinite(item?.lat) && Number.isFinite(item?.lng);

// 첫 장소를 출발지로 고정하고 나머지를 재배치한다. 첫 장소에 좌표가 없으면 출발지 없이 나머지끼리 푼다.
// 좌표가 없는 장소는 제자리에 두고, 좌표 있는 장소끼리만 그 자리들을 나눠 가진다.
const splitItems = (items) => {
  const anchor = hasCoords(items[0]) ? items[0] : null;
  const slots = items
    .map((_, index) => index)
    .filter((index) => index > 0 && hasCoords(items[index]));
  return { anchor, slots, movable: slots.map((index) => items[index]) };
};

// 최적화할 만한 일정인지: 좌표 있는 장소가 출발지 포함 3곳 이상일 때. 계산이 가벼워서 화면에서 버튼을 보일 때 쓴다.
export const canOptimizeRoute = (items) => {
  const { anchor, movable } = splitItems(items);
  return movable.length + (anchor ? 1 : 0) >= 3;
};

const pathMeters = (anchor, order) => {
  let total = 0;
  let previous = anchor;
  order.forEach((item) => {
    if (previous) total += getDistanceMeters(previous, item);
    previous = item;
  });
  return total;
};

// 모든 순서를 따져 가장 짧은 경로를 찾는다 (비트마스크 동적 계획법). 반환은 movable의 인덱스 순서다.
const solveExact = (anchor, movable) => {
  const n = movable.length;
  const dist = movable.map((a) => movable.map((b) => getDistanceMeters(a, b)));
  const start = movable.map((item) => (anchor ? getDistanceMeters(anchor, item) : 0));
  const full = 1 << n;
  const cost = Array.from({ length: full }, () => new Array(n).fill(Infinity));
  const parent = Array.from({ length: full }, () => new Array(n).fill(-1));
  for (let i = 0; i < n; i += 1) cost[1 << i][i] = start[i];

  for (let mask = 1; mask < full; mask += 1) {
    for (let last = 0; last < n; last += 1) {
      if (!(mask & (1 << last)) || cost[mask][last] === Infinity) continue;
      for (let next = 0; next < n; next += 1) {
        if (mask & (1 << next)) continue;
        const nextMask = mask | (1 << next);
        const candidate = cost[mask][last] + dist[last][next];
        if (candidate < cost[nextMask][next]) {
          cost[nextMask][next] = candidate;
          parent[nextMask][next] = last;
        }
      }
    }
  }

  let last = 0;
  for (let i = 1; i < n; i += 1) if (cost[full - 1][i] < cost[full - 1][last]) last = i;
  const order = [];
  let mask = full - 1;
  while (last !== -1) {
    order.unshift(last);
    const previous = parent[mask][last];
    mask &= ~(1 << last);
    last = previous;
  }
  return order;
};

// 장소가 많을 때: 가장 가까운 곳부터 이어 붙인 뒤, 두 구간을 뒤집어 짧아지면 바꾸는 걸 더 나아지지 않을 때까지 되풀이한다 (2-opt).
const solveApproximate = (anchor, movable) => {
  const remaining = movable.map((_, index) => index);
  const order = [];
  let current = anchor;
  while (remaining.length > 0) {
    let bestIndex = 0;
    if (current) {
      remaining.forEach((candidate, i) => {
        if (
          getDistanceMeters(current, movable[candidate]) <
          getDistanceMeters(current, movable[remaining[bestIndex]])
        )
          bestIndex = i;
      });
    }
    const [picked] = remaining.splice(bestIndex, 1);
    order.push(picked);
    current = movable[picked];
  }

  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 0; i < order.length - 1; i += 1) {
      for (let j = i + 1; j < order.length; j += 1) {
        const candidate = [
          ...order.slice(0, i),
          ...order.slice(i, j + 1).reverse(),
          ...order.slice(j + 1),
        ];
        const gain =
          pathMeters(
            anchor,
            order.map((k) => movable[k]),
          ) -
          pathMeters(
            anchor,
            candidate.map((k) => movable[k]),
          );
        if (gain > MIN_GAIN_METERS) {
          order.splice(0, order.length, ...candidate);
          improved = true;
        }
      }
    }
  }
  return order;
};

// 한 DAY의 장소를 이동 거리가 가장 짧은 순서로 다시 놓을 계획을 만든다 (69). 직선거리 기준이라 구간 교통 추정과 같다.
// 반환: { canOptimize, orderedIds(새 순서의 id 전체), beforeMeters, afterMeters, isImproved }
// canOptimize가 false(좌표 있는 장소 3곳 미만)이거나 이미 가장 짧으면 orderedIds는 지금 순서 그대로다.
export const optimizeRoute = (items) => {
  const currentIds = items.map((item) => item.id);
  const { anchor, slots, movable } = splitItems(items);
  const before = pathMeters(anchor, movable);
  const unchanged = {
    canOptimize: canOptimizeRoute(items),
    orderedIds: currentIds,
    beforeMeters: before,
    afterMeters: before,
    isImproved: false,
  };
  if (!unchanged.canOptimize) return unchanged;

  const order =
    movable.length <= EXACT_LIMIT ? solveExact(anchor, movable) : solveApproximate(anchor, movable);
  const reordered = order.map((index) => movable[index]);
  const after = pathMeters(anchor, reordered);
  if (before - after < MIN_GAIN_METERS) return unchanged;

  const orderedIds = [...currentIds];
  slots.forEach((slot, i) => {
    orderedIds[slot] = reordered[i].id;
  });
  return { ...unchanged, orderedIds, afterMeters: after, isImproved: true };
};
