// 식사 시간대 (45). 12시·18시 앞뒤 1시간을 식사 시간대로 본다.
const MEAL_WINDOWS = [
  { mealTime: 'lunch', from: 11 * 60, to: 13 * 60 },
  { mealTime: 'dinner', from: 17 * 60, to: 19 * 60 },
];

export const MEAL_TIMES = MEAL_WINDOWS.map((range) => range.mealTime);

const toMinutes = (time) => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time ?? '');
  if (!match) return null;
  const [hours, minutes] = [Number(match[1]), Number(match[2])];
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
};

// 장소를 다 보고 나오는 시각이 식사 시간대면 그 끼니를 돌려준다. 식당은 '이 장소 다음'에 갈 곳이라 끝나는 시각으로 본다.
// 시각이 없거나 형식이 틀리면 null — 안내 없이 평소처럼 보여준다.
export function getMealTime(startTime, stayMinutes = 0) {
  const start = toMinutes(startTime);
  if (start === null) return null;
  const end = (start + Math.max(0, Number(stayMinutes) || 0)) % (24 * 60);
  return MEAL_WINDOWS.find((range) => end >= range.from && end <= range.to)?.mealTime ?? null;
}
