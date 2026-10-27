import { CITY_CODES } from './flightOptions';

// 실제 예약은 외부 사이트로 보낸다 (49). 제휴·API 없이 출발지·도착지·날짜·인원을 채운 일반 검색 링크.
// 날짜는 'YYYY-MM-DD'를 사이트마다 원하는 모양으로 바꾼다.
const compactDate = (date) => date.replaceAll('-', '');

export function getFlightSearchLinks({ from, city, startDate, endDate, people }) {
  const to = CITY_CODES[city];
  if (!from || !to || !startDate || !endDate) return [];

  return [
    {
      key: 'skyscanner',
      href: `https://www.skyscanner.co.kr/transport/flights/${from.toLowerCase()}/${to.toLowerCase()}/${compactDate(startDate).slice(2)}/${compactDate(endDate).slice(2)}/?adultsv2=${people}`,
    },
    {
      key: 'naver',
      href: `https://flight.naver.com/flights/international/${from}-${to}-${compactDate(startDate)}/${to}-${from}-${compactDate(endDate)}?adult=${people}`,
    },
  ];
}
