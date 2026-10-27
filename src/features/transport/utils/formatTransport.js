// 이동 시간(분)을 "12분" / "1시간" / "1시간 5분"으로 보여 줄 값으로 나눈다.
// 글자는 화면(t)에서 붙이고, 여기서는 숫자만 계산한다.
export const splitMinutes = (totalMinutes) => ({
  hours: Math.floor(totalMinutes / 60),
  minutes: totalMinutes % 60,
});

export const formatAmount = (amount, locale = 'ko') => amount.toLocaleString(locale);

// 이동 시간(분)을 화면 글자로: "12분" / "1시간" / "1시간 5분". t는 i18n 번역 함수다.
export const formatDuration = (t, totalMinutes) => {
  const { hours, minutes } = splitMinutes(totalMinutes);
  if (hours === 0) return t('planner.transport.duration.minutes', { minutes });
  if (minutes === 0) return t('planner.transport.duration.hours', { hours });
  return t('planner.transport.duration.hoursMinutes', { hours, minutes });
};

// 요금을 나라별 통화 글자로: "6,790원" / "720엔"
export const formatCost = (t, locale, country, cost) =>
  t(`planner.transport.currency.${country}`, { amount: formatAmount(cost, locale) });
