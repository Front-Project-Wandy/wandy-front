export const MAX_PEOPLE = 20;

// 오늘 날짜를 'YYYY-MM-DD'로. toISOString()은 UTC 기준이라 한국 오전 9시 전에는 어제 날짜가 나와서 쓰지 않는다.
export function getTodayString(now = new Date()) {
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

// 홈 시작 영역 입력 검사. 문제가 있는 칸만 { 칸 이름: 번역 키 } 로 돌려준다 (없으면 빈 객체).
// 날짜는 'YYYY-MM-DD' 문자열이라 글자 비교만으로 앞뒤를 알 수 있다.
// input의 min은 달력 선택만 막고 키보드 입력은 못 막아서, 지난 날짜도 여기서 직접 검사한다.
export function validateTripStart(
  { country, city, startDate, endDate, people },
  today = getTodayString(),
) {
  const errors = {};
  const peopleCount = Number(people);

  if (!country) errors.country = 'home.start.error.country';
  if (!city) errors.city = 'home.start.error.city';
  if (!startDate || !endDate) errors.dates = 'home.start.error.dates';
  else if (startDate < today) errors.dates = 'home.start.error.pastDate';
  else if (endDate < startDate) errors.dates = 'home.start.error.dateOrder';
  if (!Number.isInteger(peopleCount) || peopleCount < 1 || peopleCount > MAX_PEOPLE) {
    errors.people = 'home.start.error.people';
  }

  return errors;
}
