// toISOString()은 UTC 기준이라 한국 시간에서 하루 어긋날 수 있어 로컬 기준으로 만든다
export const toDateString = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const getDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return [];
  const [sy, sm, sd] = startDate.split('-').map(Number);
  const [ey, em, ed] = endDate.split('-').map(Number);
  const current = new Date(sy, sm - 1, sd);
  const end = new Date(ey, em - 1, ed);
  const dates = [];
  while (current <= end) {
    dates.push(toDateString(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

// 날짜를 밀어도 일정이 DAY 번호에 붙어 있도록, 날짜가 아니라 순서로 기존 DAY를 이어 붙인다.
// 시작일이 종료일보다 늦는 등 날짜가 아직 맞지 않으면 기존 일정을 지우지 않으려고 그대로 둔다.
export const buildDays = (startDate, endDate, prevDays = []) => {
  const dates = getDateRange(startDate, endDate);
  if (dates.length === 0) return prevDays;

  const days = dates.map((date, i) => ({ date, items: prevDays[i]?.items ?? [] }));

  const overflow = prevDays.slice(dates.length).flatMap((day) => day.items);
  if (overflow.length > 0) {
    const last = days[days.length - 1];
    last.items = [...last.items, ...overflow];
  }
  return days;
};

// 'YYYY-MM-DD'에 days일을 더한 날짜 (로컬 기준). 월·연도를 넘겨도 맞는다.
export const addDays = (dateString, days) => {
  const [y, m, d] = dateString.split('-').map(Number);
  return toDateString(new Date(y, m - 1, d + days));
};
