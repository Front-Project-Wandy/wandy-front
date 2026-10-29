// 여행 기간(startDate~endDate, 'YYYY-MM-DD')과 겹치는 공휴일·행사를 날짜순으로 돌려준다 (요구사항 #92).
// 공휴일은 날짜가 정해져 있고, 행사는 해마다 같은 'MM-DD' 구간이라 여행이 걸친 해마다 풀어서 비교한다.
// 같은 형식의 문자열은 사전순이 곧 날짜순이라 문자열 그대로 비교한다.
export const getTripHolidays = ({ startDate, endDate }, countryData) => {
  if (!startDate || !endDate || !countryData) return [];

  const holidays = countryData.holidays
    .filter(({ date }) => date >= startDate && date <= endDate)
    .map(({ date, name }) => ({ type: 'holiday', start: date, end: date, name, note: null }));

  const startYear = Number(startDate.slice(0, 4));
  const endYear = Number(endDate.slice(0, 4));
  const events = [];
  // 12-29 ~ 01-03처럼 해를 넘기는 행사는 전년도 시작분도 봐야 해서 한 해 앞에서부터 푼다
  for (let year = startYear - 1; year <= endYear; year += 1) {
    countryData.events.forEach(({ start, end, name, note }) => {
      const crossesYear = end < start;
      const eventStart = `${year}-${start}`;
      const eventEnd = `${crossesYear ? year + 1 : year}-${end}`;
      if (eventStart <= endDate && eventEnd >= startDate) {
        events.push({ type: 'event', start: eventStart, end: eventEnd, name, note });
      }
    });
  }

  return [...holidays, ...events].sort((a, b) => a.start.localeCompare(b.start));
};
