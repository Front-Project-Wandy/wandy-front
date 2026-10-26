import stayData from '../../../mocks/stays.json';

// STEP3 숙소에서 쓰는 값과 계산 (화면 코드와 분리).

// 도시별 숙소 지역(대략적인 중심 좌표). 직접 입력한 숙소도 지역을 고르면 이 좌표를 동선 기준점으로 쓴다.
// 주소 글자만으로는 좌표를 알 수 없어서(주소→좌표 변환은 서버 API가 필요) 지역으로 받는다.
export const getStayAreas = (city) => stayData.areas[city] ?? [];
export const findStayArea = (city, key) =>
  getStayAreas(city).find((area) => area.key === key) ?? null;

// draft.stay 모양. null이면 아직 고르지 않았거나 건너뛴 것.
//   status: 'booked'(이미 예약함, 직접 입력) | 'searching'(아직 안 함, 목업에서 고름)
//   checkInTime: 첫날 체크인 'HH:mm', checkOutTime: 마지막 날 체크아웃 'HH:mm'
export const EMPTY_STAY = {
  status: null,
  area: null,
  mockId: null,
  name: '',
  address: '',
  lat: null,
  lng: null,
  checkInTime: '15:00',
  checkOutTime: '11:00',
  link: null,
};

// [다음]을 눌렀을 때 검사. 문제가 있으면 번역 키, 없으면 null.
export function validateStay(stay) {
  if (!stay?.status) return 'wizard.stay.error.choose';
  if (stay.status === 'searching') return stay.mockId ? null : 'wizard.stay.error.pick';
  if (!stay.name.trim()) return 'wizard.stay.error.name';
  if (!stay.area) return 'wizard.stay.error.area';
  if (!stay.checkInTime || !stay.checkOutTime) return 'wizard.stay.error.times';
  return null;
}

// 목업 숙소 하나를 고르면 draft.stay에 넣을 값.
export const stayFromMock = (mock, link) => ({
  ...EMPTY_STAY,
  status: 'searching',
  area: mock.area,
  mockId: mock.id,
  name: mock.name,
  lat: mock.lat,
  lng: mock.lng,
  checkInTime: mock.checkIn,
  checkOutTime: mock.checkOut,
  link,
});

// 플랜 store(C) setStay 모양 { name, lat, lng, checkIn, checkOut, link }으로 바꾼다.
// 시각만 받았으니 날짜는 여행 첫날(체크인)·마지막 날(체크아웃)을 붙인다.
export function toPlanStay(stay, { startDate, endDate }) {
  if (!stay?.status || !stay.name.trim() || stay.lat === null) return null;
  return {
    name: stay.name.trim(),
    address: stay.address.trim() || null,
    lat: stay.lat,
    lng: stay.lng,
    checkIn: `${startDate}T${stay.checkInTime}`,
    checkOut: `${endDate}T${stay.checkOutTime}`,
    link: stay.link,
  };
}

// STEP5 "가까운 순" 기준점 (PlaceSearchPanel origin). 좌표가 있는 숙소만.
export const toStayOrigin = (stay) =>
  stay?.lat !== null && stay?.lat !== undefined
    ? { lat: stay.lat, lng: stay.lng, name: stay.name }
    : null;
