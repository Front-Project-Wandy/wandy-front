import { toDateString } from '../../../store/plan/planDays';

// 복제 창에서 고른 가는 날을 검사한다. 통과하면 빈 객체, 아니면 { startDate: 번역 키 }.
// 날짜 문자열('YYYY-MM-DD')은 앞자리부터 비교해도 순서가 맞아서 그대로 견준다.
export const validateDuplicateForm = ({ startDate }, today = toDateString(new Date())) => {
  if (!startDate) return { startDate: 'planner.duplicate.error.startDate' };
  if (startDate < today) return { startDate: 'planner.duplicate.error.pastDate' };
  return {};
};
