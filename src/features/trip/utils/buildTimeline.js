import { estimateTransport } from '../../transport/utils/estimateTransport';

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const MINUTES_PER_DAY = 24 * 60;

// 'HH:mm'을 그날 0시부터의 분으로. 형식이 틀리면 null이다.
export const toMinutes = (time) => {
  const match = TIME_PATTERN.exec(time ?? '');
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
};

// 분을 'HH:mm'으로. 하루를 넘으면(다음 날 01:00 = 1500분) 다음 날의 시각으로 돌려준다.
export const formatClock = (minutes) => {
  const wrapped = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return `${String(Math.floor(wrapped / 60)).padStart(2, '0')}:${String(wrapped % 60).padStart(2, '0')}`;
};

// 한 DAY의 장소를 타임라인으로 그릴 값으로 바꾼다 (80). 목록 순서 그대로이고, 시간순으로 다시 늘어놓지 않는다.
// 장소마다 시작·끝(분), 끝이 다음 날로 넘어가는지, 다음 장소까지의 이동(구간 줄과 같은 estimateTransport),
// 그리고 여유 시간(slackMinutes = 다음 시작 − (끝 + 이동))을 구한다. 음수면 이동까지 넣으면 모자라다는 뜻이다.
// isNextEarlier: 다음 장소가 이 장소보다 먼저 시작하는 경우(순서와 시간이 어긋남)라서 여유 대신 순서 경고를 보여 준다.
// 좌표가 없어 이동을 계산할 수 없으면 leg와 slackMinutes는 null이다.
export const buildTimeline = ({ items, country, transportMode }) =>
  items.map((item, index) => {
    const next = items[index + 1];
    const startMinutes = toMinutes(item.startTime);
    const endMinutes = startMinutes === null ? null : startMinutes + item.stayMinutes;
    const nextStart = next ? toMinutes(next.startTime) : null;
    const leg = next ? estimateTransport({ from: item, to: next, country, transportMode }) : null;
    const isNextEarlier = startMinutes !== null && nextStart !== null && nextStart < startMinutes;

    return {
      item,
      startMinutes,
      endMinutes,
      endsNextDay: endMinutes !== null && endMinutes >= MINUTES_PER_DAY,
      leg,
      isNextEarlier,
      slackMinutes:
        leg && endMinutes !== null && nextStart !== null && !isNextEarlier
          ? nextStart - (endMinutes + leg.minutes)
          : null,
    };
  });
