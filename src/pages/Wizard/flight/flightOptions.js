// STEP2 항공에서 쓰는 값과 계산 (화면 코드와 분리).

// 출발 공항 후보 — 한국 사용자가 해외로 나가는 주요 공항. 처음에는 아무것도 고르지 않는다.
export const KR_AIRPORTS = ['ICN', 'GMP', 'PUS', 'CJU', 'TAE', 'CJJ'];

// 여행 도시 → 외부 예약 사이트 검색에 쓰는 도시 코드 (도쿄 = 나리타·하네다를 묶은 TYO).
export const CITY_CODES = { tokyo: 'TYO' };

// draft.flight 모양. null이면 아직 고르지 않았거나 건너뛴 것.
//   status: 'booked'(이미 예약함, 직접 입력) | 'searching'(아직 안 함, 목업에서 고름)
//   arriveTime: 가는 편 도착 시각 'HH:mm' (첫날), departTime: 오는 편 출발 시각 'HH:mm' (마지막 날)
export const EMPTY_FLIGHT = {
  status: null,
  departureAirport: null,
  mockId: null,
  flightNo: '',
  returnFlightNo: '',
  arriveTime: '',
  departTime: '',
  link: null,
};

// [다음]을 눌렀을 때 검사. 문제가 있으면 번역 키, 없으면 null.
export function validateFlight(flight, { isSameDay }) {
  if (!flight?.status) return 'wizard.flight.error.choose';
  if (flight.status === 'searching' && !flight.mockId) return 'wizard.flight.error.pick';
  if (flight.status === 'booked') {
    if (!flight.arriveTime || !flight.departTime) return 'wizard.flight.error.times';
    // 당일치기면 같은 날 안에서 도착이 출발보다 먼저여야 한다.
    if (isSameDay && flight.arriveTime >= flight.departTime) return 'wizard.flight.error.order';
  }
  return null;
}

// 목업 항공편 하나를 고르면 draft.flight에 넣을 값.
export const flightFromMock = (mock, link) => ({
  ...EMPTY_FLIGHT,
  status: 'searching',
  departureAirport: mock.from,
  mockId: mock.id,
  flightNo: mock.outbound.flightNo,
  returnFlightNo: mock.inbound.flightNo,
  arriveTime: mock.outbound.arriveTime,
  departTime: mock.inbound.departTime,
  link,
});

// 플랜 store(C) setFlight 모양 { flightNo, arriveAt, departAt, link }으로 바꾼다.
// 시각만 받았으니 날짜는 여행 첫날·마지막 날을 붙인다.
export function toPlanFlight(flight, { startDate, endDate }) {
  if (!flight?.status || !flight.arriveTime || !flight.departTime) return null;
  return {
    flightNo: flight.flightNo.trim() || null,
    returnFlightNo: flight.returnFlightNo.trim() || null,
    arriveAt: `${startDate}T${flight.arriveTime}`,
    departAt: `${endDate}T${flight.departTime}`,
    link: flight.link,
  };
}
