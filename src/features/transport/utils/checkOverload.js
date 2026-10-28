import { OVERLOAD_MINUTES } from '../constants';

// 여행 스타일에 맞는 하루 이동 시간 기준(분). 모르는 스타일이면 normal 기준을 쓴다.
export const getOverloadMinutes = (style) => OVERLOAD_MINUTES[style] ?? OVERLOAD_MINUTES.normal;

// 하루 이동 합계(분)가 기준 이상이면 과밀하다. 막지 않고 알려 주기만 한다(항공 시간 경고와 같은 방식).
export const isOverloadedDay = ({ minutes, style }) => minutes >= getOverloadMinutes(style);
