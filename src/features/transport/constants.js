// 이 숫자들은 실제 경로 API(Directions) 없이 쓰는 "추정치"다. 비밀 키라 프론트에 둘 수 없어서
// 2단계 백엔드에서 실제 값으로 바꾸고, 그때까지 여기서만 고치면 된다.

// 이 거리 안이면 수단을 고른 것과 상관없이 걸어서 간다고 본다
export const WALK_MAX_METERS = 1000;

// 직선거리는 실제 길보다 짧아서 곱해 준다 (도로·환승으로 돌아가는 몫)
export const ROUTE_FACTOR = 1.3;

// 평균 이동 속도(km/h). 대중교통은 기다리는 시간과 환승을 포함한 값이다.
export const SPEED_KMH = { walk: 4.5, transit: 20, taxi: 25, car: 30 };

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

// 요금은 정확한 값이 아니라서 이 단위로 반올림해 보여 준다
export const COST_ROUND_UNIT = 10;
