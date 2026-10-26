// 이동 시간(분)을 "12분" / "1시간" / "1시간 5분"으로 보여 줄 값으로 나눈다.
// 글자는 화면(t)에서 붙이고, 여기서는 숫자만 계산한다.
export const splitMinutes = (totalMinutes) => ({
  hours: Math.floor(totalMinutes / 60),
  minutes: totalMinutes % 60,
});

export const formatAmount = (amount, locale = 'ko') => amount.toLocaleString(locale);
