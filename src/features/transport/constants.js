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

// 요금은 정확한 값이 아니라서 이 단위로 반올림해 보여 준다
export const COST_ROUND_UNIT = 10;
