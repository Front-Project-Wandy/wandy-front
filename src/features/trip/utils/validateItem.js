import { MAX_STAY_MINUTES, MIN_STAY_MINUTES } from '../constants';

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

// 값은 입력창에서 온 글자 그대로 받는다. 에러는 화면에서 t()로 바꿀 번역 키로 돌려준다.
export const validateItemForm = ({ startTime, stayMinutes }) => {
  const errors = {};
  if (!TIME_PATTERN.test(startTime)) errors.startTime = 'planner.edit.error.startTime';

  const minutes = Number(stayMinutes);
  if (
    String(stayMinutes).trim() === '' ||
    !Number.isInteger(minutes) ||
    minutes < MIN_STAY_MINUTES ||
    minutes > MAX_STAY_MINUTES
  )
    errors.stayMinutes = 'planner.edit.error.stayMinutes';

  return errors;
};
