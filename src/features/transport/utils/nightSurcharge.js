import { NIGHT_SURCHARGE } from '../constants';

const MINUTES_PER_DAY = 24 * 60;

// 'HH:mm'과 체류 시간(분)으로 앞 장소에서 출발하는 시각을 "하루 중 몇 분째"로 돌려준다.
// 자정을 넘기면 다음 날로 돌려서 계산하고, 시각이나 체류 시간을 모르면 null이다.
export const getDepartureMinutes = ({ startTime, stayMinutes }) => {
  const match = /^(\d{2}):(\d{2})$/.exec(startTime ?? '');
  if (!match || !Number.isFinite(stayMinutes)) return null;
  return (Number(match[1]) * 60 + Number(match[2]) + stayMinutes) % MINUTES_PER_DAY;
};

// 출발 시각(하루 중 분)에 붙는 심야 할증률(0.2 = 20%). 할증 시간대가 아니면 0.
// 구간은 [시작, 끝)이고, 자정을 넘는 구간은 끝이 1440을 넘게 적어 두었으므로 다음 날 몫도 같이 본다.
export const getNightSurchargeRate = (country, departureMinutes) => {
  if (departureMinutes === null) return 0;
  const range = (NIGHT_SURCHARGE[country] ?? []).find(
    ({ from, to }) =>
      (departureMinutes >= from && departureMinutes < to) ||
      (departureMinutes + MINUTES_PER_DAY >= from && departureMinutes + MINUTES_PER_DAY < to),
  );
  return range ? range.rate : 0;
};
