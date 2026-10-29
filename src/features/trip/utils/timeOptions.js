// 시작 시간 선택창의 선택지. 브라우저 기본 시간 입력은 컴퓨터 설정에 따라 오전/오후 12시간제로 보여서
// 14시·15시 같은 값을 고르기 헷갈리므로, 24시간제로 시와 분을 따로 고르게 한다.
export const HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, '0'));

const MINUTE_STEP = 5;
const BASE_MINUTE_OPTIONS = Array.from({ length: 60 / MINUTE_STEP }, (_, i) =>
  String(i * MINUTE_STEP).padStart(2, '0'),
);

// 'HH:mm'을 시·분 글자로 나눈다. 형식이 틀리면 둘 다 빈 글자로 돌려준다.
export const splitTime = (value) => {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value ?? '');
  return match ? { hour: match[1], minute: match[2] } : { hour: '', minute: '' };
};

// 분은 5분 단위로 고르게 하되, 이미 10:07처럼 5분 단위가 아닌 값이 저장돼 있으면
// 그 값이 사라지지 않도록 선택지에 같이 넣는다.
export const getMinuteOptions = (currentMinute) =>
  currentMinute && !BASE_MINUTE_OPTIONS.includes(currentMinute)
    ? [...BASE_MINUTE_OPTIONS, currentMinute].sort()
    : BASE_MINUTE_OPTIONS;
