// STEP2 항공에서 쓰는 값과 계산 (화면 코드와 분리).
import { getFlightSearchLinks } from './flightLinks';

// 출발 공항 후보 — 한국 사용자가 해외로 나가는 주요 공항. 처음에는 아무것도 고르지 않는다.
export const KR_AIRPORTS = ['ICN', 'GMP', 'PUS', 'CJU', 'TAE', 'CJJ'];

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
  // 가는 편 도착 공항 코드 ('NRT' 등). 목업에서 고르면 채워지고, 직접 입력하면 null (플랜에서 도시 대표 공항으로 가정)
  arriveAirport: null,
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
  arriveAirport: mock.to,
  link,
});

// 플랜 store(C) setFlight 모양 { flightNo, returnFlightNo, arriveAirport, arriveAt, departAt, link }으로 바꾼다.
// 시각만 받았으니 날짜는 여행 첫날·마지막 날을 붙인다.
// 목업에서 고른 항공편의 예약 링크는 고른 순간의 날짜·인원으로 만들어져서, 그 뒤 STEP1에서 날짜를 바꾸면 어긋난다.
// 그래서 저장할 때 지금 날짜·인원으로 다시 만든다 (만들 수 없으면 원래 링크).
export function toPlanFlight(flight, trip) {
  if (!flight?.status || !flight.arriveTime || !flight.departTime) return null;
  const { startDate, endDate } = trip;
  const link =
    flight.status === 'searching'
      ? (getFlightSearchLinks({ from: flight.departureAirport, ...trip })[0]?.href ?? flight.link)
      : flight.link;
  return {
    flightNo: flight.flightNo.trim() || null,
    returnFlightNo: flight.returnFlightNo.trim() || null,
    arriveAirport: flight.arriveAirport ?? null,
    arriveAt: `${startDate}T${flight.arriveTime}`,
    departAt: `${endDate}T${flight.departTime}`,
    link,
  };
}
