import { formatClock, toMinutes } from '../../trip/utils/buildTimeline';

// 상품을 일정에 넣을 때 쓰는 값 (84). 플랜 store의 addItem은 Place를 받아 item으로 바꾸므로,
// 상품을 Place 모양으로 바꿔 넘긴다 — item 모양은 그대로 두고 source만 'product'가 새로 생긴다.
// - placeId: Place.id처럼 '출처:원본ID'라 'product:상품id'. 플래너에서 상품 상세로 돌아갈 때 쓴다.
// - name: 상품 이름을 저장한다 (구글 장소가 아니라 이름을 저장해도 된다).
// - lat·lng: 상품에는 모이는 곳 좌표가 없어서 null. 지도 마커·구간 교통·동선 최적화는 좌표 없는 장소를 건너뛴다.
// - category(myCategory): 상품 종류는 장소 카테고리와 값이 달라서 null. 입장료·식비 추정과 취향 계산에서 빠진다.
export const PRODUCT_SOURCE = 'product';
const PRODUCT_ID_PREFIX = `${PRODUCT_SOURCE}:`;

export const toProductPlaceId = (productId) => `${PRODUCT_ID_PREFIX}${productId}`;

// 상품으로 넣은 item이면 상품 id, 아니면 null
export const getItemProductId = (item) =>
  item?.source === PRODUCT_SOURCE && item.placeId?.startsWith(PRODUCT_ID_PREFIX)
    ? item.placeId.slice(PRODUCT_ID_PREFIX.length)
    : null;

export const hasProductInItems = (items, productId) =>
  items.some((item) => getItemProductId(item) === productId);

// 상품을 넣을 수 있는 여행: 같은 나라·도시이고, 날짜가 정해져 DAY가 있고, 아직 끝나지 않은 여행.
// today는 'YYYY-MM-DD' (로컬 날짜). 순서는 useAllTrips 그대로(지금 여는 여행 먼저)다.
export const pickTripsForProduct = (trips, product, today) =>
  trips.filter(
    (trip) =>
      trip.country === product.country &&
      trip.city === product.city &&
      trip.days?.length > 0 &&
      (!trip.endDate || trip.endDate >= today),
  );

export const toProductPlace = (product) => ({
  id: toProductPlaceId(product.id),
  source: PRODUCT_SOURCE,
  name: product.title,
  lat: null,
  lng: null,
  category: null,
});

// 체류 시간 입력이 받는 범위 (ItemEditForm과 같다). 넘으면 기본값(90분)에 맡긴다.
const MAX_STAY_MINUTES = 720;
const TIME_STEP_MINUTES = 5;

// 목업 상품의 소요 시간 글자('3시간', '1시간 30분', '약 2시간')를 분으로. '자유 이용'·'1일'이나
// 하루 일정에 넣기엔 너무 긴 패스('24시간')는 null을 돌려 store 기본값을 쓰게 한다.
export function parseDurationMinutes(duration) {
  const hours = /(\d+)\s*시간/.exec(duration ?? '');
  const minutes = /(\d+)\s*분/.exec(duration ?? '');
  if (!hours && !minutes) return null;
  const total = Number(hours?.[1] ?? 0) * 60 + Number(minutes?.[1] ?? 0);
  return total > 0 && total <= MAX_STAY_MINUTES ? total : null;
}

// 그날 마지막 장소가 끝나는 시각(5분 단위 올림)에 넣어 시간 순서 경고가 뜨지 않게 한다.
// 장소가 없거나 자정을 넘기면 null — store 기본값(10:00)을 쓴다.
export function getNextStartTime(items) {
  const last = items.at(-1);
  const start = toMinutes(last?.startTime);
  if (start === null) return null;
  const end = Math.ceil((start + last.stayMinutes) / TIME_STEP_MINUTES) * TIME_STEP_MINUTES;
  return end < 24 * 60 ? formatClock(end) : null;
}

// addItem 세 번째 인자. null 값은 store가 기본값으로 바꾼다.
export const buildProductItemOptions = (product, items) => ({
  startTime: getNextStartTime(items),
  stayMinutes: parseDurationMinutes(product.duration),
});
