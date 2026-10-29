import { MAX_TRIP_DAYS } from '../../features/ai/utils/normalizeTripRequest';

export const MAX_PEOPLE = 20;
// 여행 최대 일수. AI 한 줄 입력과 같은 값을 써서 어느 쪽으로 시작해도 같은 기준이 되게 한다.
export { MAX_TRIP_DAYS };

// 'YYYY-MM-DD' (연도 4자리). 날짜 칸에 5자리 연도를 넣으면 글자 비교가 어긋나고 DAY가 수만 개 만들어질 수 있다.
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
// 날짜 칸 max. 달력과 키보드 입력이 5자리 연도로 넘어가지 않게 막는다 (검사는 위 패턴이 한 번 더 한다).
export const MAX_DATE = '9999-12-31';
const DAY_MS = 24 * 60 * 60 * 1000;

// 가는 날~오는 날 일수 (당일 = 1). 하루씩 세지 않고 빼서 구해, 기간이 아무리 길어도 바로 끝난다.
// Date.UTC로 계산해서 서머타임 같은 시차 변화에 흔들리지 않는다.
const countTripDays = (startDate, endDate) => {
  const toUtc = (date) => {
    const [year, month, day] = date.split('-').map(Number);
    return Date.UTC(year, month - 1, day);
  };
  return Math.round((toUtc(endDate) - toUtc(startDate)) / DAY_MS) + 1;
};

// 오늘 날짜를 'YYYY-MM-DD'로. toISOString()은 UTC 기준이라 한국 오전 9시 전에는 어제 날짜가 나와서 쓰지 않는다.
export function getTodayString(now = new Date()) {
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

// 여행 기본 정보 입력 검사 — 홈 시작 영역과 마법사 STEP1이 같이 쓴다.
// 문제가 있는 칸만 { 칸 이름: 번역 키 } 로 돌려준다 (없으면 빈 객체).
// 날짜는 'YYYY-MM-DD' 문자열이라 글자 비교만으로 앞뒤를 알 수 있다.
// input의 min은 달력 선택만 막고 키보드 입력은 못 막아서, 지난 날짜도 여기서 직접 검사한다.
// 칸 이름 → 그 칸의 에러 이름. 가는 날·오는 날은 에러 문구 하나(dates)를 같이 쓴다.
const ERROR_FIELD = {
  country: 'country',
  city: 'city',
  startDate: 'dates',
  endDate: 'dates',
  people: 'people',
};

// 칸을 고치면 그 칸의 에러는 바로 지운다. 다시 검사하는 건 버튼을 누를 때.
// (그대로 두면 나라를 골랐는데도 "나라를 골라 주세요"가 남아 있다)
export function clearFieldErrors(errors, patch) {
  const next = { ...errors };
  Object.keys(patch).forEach((field) => delete next[ERROR_FIELD[field]]);
  return next;
}

export function validateBasicInfo(
  { country, city, startDate, endDate, people },
  today = getTodayString(),
) {
  const errors = {};
  const peopleCount = Number(people);

  if (!country) errors.country = 'wizard.basic.error.country';
  if (!city) errors.city = 'wizard.basic.error.city';
  if (!startDate || !endDate) errors.dates = 'wizard.basic.error.dates';
  else if (!DATE_PATTERN.test(startDate) || !DATE_PATTERN.test(endDate)) {
    errors.dates = 'wizard.basic.error.invalidDate';
  } else if (startDate < today) errors.dates = 'wizard.basic.error.pastDate';
  else if (endDate < startDate) errors.dates = 'wizard.basic.error.dateOrder';
  else if (countTripDays(startDate, endDate) > MAX_TRIP_DAYS) {
    errors.dates = 'wizard.basic.error.tooLong';
  }
  if (!Number.isInteger(peopleCount) || peopleCount < 1 || peopleCount > MAX_PEOPLE) {
    errors.people = 'wizard.basic.error.people';
  }

  return errors;
}

// 마법사를 이어서 열거나 저장하기 직전에 STEP1 값이 아직 괜찮은지 본다.
export const hasBasicInfoErrors = (values, today = getTodayString()) =>
  Object.keys(validateBasicInfo(values, today)).length > 0;
