// 이 숫자들은 실제 경로 API(Directions) 없이 쓰는 "추정치"다. 비밀 키라 프론트에 둘 수 없어서
// 2단계 백엔드에서 실제 값으로 바꾸고, 그때까지 여기서만 고치면 된다.

// 이 거리 안이면 수단을 고른 것과 상관없이 걸어서 간다고 본다
export const WALK_MAX_METERS = 1000;

// 직선거리는 실제 길보다 짧아서 곱해 준다 (도로·환승으로 돌아가는 몫)
export const ROUTE_FACTOR = 1.3;

// 평균 이동 속도(km/h). 대중교통은 기다리는 시간과 환승을 포함한 값이다.
// 도보는 요구사항 #19(시속 4km)에 맞춘다. 나라와 상관없이 같은 값을 쓴다.
export const SPEED_KMH = { walk: 4, transit: 20, taxi: 25, car: 30 };

// 나라별 현지 통화 기준 요금: 기본요금 + 거리(km)당 요금. 화면에서 통화 표시만 바꾼다.
export const FARES = {
  KR: {
    transit: { base: 1500, perKm: 100 },
    taxi: { base: 4800, perKm: 1000 },
    car: { base: 0, perKm: 200 },
  },
  JP: {
    transit: { base: 180, perKm: 40 },
    taxi: { base: 500, perKm: 400 },
    car: { base: 0, perKm: 60 },
  },
};

// 택시 심야 할증 (요구사항 #60). 출발 시각이 구간 [from, to)에 들면 택시 요금 전체에 rate를 더한다.
// 시각은 그날 0시부터의 분이고, 자정을 넘는 구간은 to가 1440을 넘는다.
// 서울은 중형택시 기준 22~23시·02~04시 20%, 23~02시 40% (서울시 2022-12-01 시행).
// 도쿄는 22~05시 20%인데, 실제로는 미터 거리가 2할 짧아지는 방식이라 요금에 ×1.2로 단순화했다.
export const NIGHT_SURCHARGE = {
  KR: [
    { from: 22 * 60, to: 23 * 60, rate: 0.2 },
    { from: 23 * 60, to: 26 * 60, rate: 0.4 },
    { from: 26 * 60, to: 28 * 60, rate: 0.2 },
  ],
  JP: [{ from: 22 * 60, to: 29 * 60, rate: 0.2 }],
};

// 하루 이동 시간이 이만큼(분) 이상이면 일정이 과밀하다고 알려 준다 (여행 스타일별, 요구사항 #70).
// 여행 스타일을 모르거나 정해지지 않았으면 normal 기준을 쓴다.
export const OVERLOAD_MINUTES = { relaxed: 120, normal: 180, packed: 240 };

// 요금은 정확한 값이 아니라서 이 단위로 반올림해 보여 준다
export const COST_ROUND_UNIT = 10;

// 공항 (요구사항 #52). 공항 → 숙소 이동을 추정할 때 쓰는 좌표다. 나라는 어느 나라 안의 공항인지다.
export const AIRPORTS = {
  ICN: { country: 'KR', lat: 37.4602, lng: 126.4407 },
  GMP: { country: 'KR', lat: 37.5586, lng: 126.7906 },
  NRT: { country: 'JP', lat: 35.772, lng: 140.3929 },
  HND: { country: 'JP', lat: 35.5494, lng: 139.7798 },
};

// 항공편에서 도착 공항을 알 수 없을 때(직접 입력 등) 여행 도시의 대표 공항으로 계산한다.
export const DEFAULT_AIRPORT = { seoul: 'ICN', tokyo: 'HND' };

// 공항은 도심에서 멀어서 도심 기준 속도(SPEED_KMH)로 구하면 시간이 너무 길게 나온다.
// 공항철도·리무진·고속도로를 감안한 평균 속도(km/h). 도보는 공항 이동에 쓰지 않는다.
export const AIRPORT_SPEED_KMH = { transit: 45, taxi: 50, car: 50 };
