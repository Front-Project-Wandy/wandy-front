// 실제 숙소 예약은 외부 사이트로 보낸다 (49). 제휴·API 없이 지역·날짜·인원을 채운 일반 검색 링크.
// 두 사이트 모두 검색어(지역 이름)를 글자로 받아서, 사이트별 도시 번호 없이 쓸 수 있다.
export function getStaySearchLinks({ searchName, startDate, endDate, people }) {
  if (!searchName || !startDate || !endDate) return [];
  const query = encodeURIComponent(searchName);

  return [
    {
      key: 'booking',
      href: `https://www.booking.com/searchresults.ko.html?ss=${query}&checkin=${startDate}&checkout=${endDate}&group_adults=${people}&no_rooms=1`,
    },
    {
      key: 'airbnb',
      href: `https://www.airbnb.co.kr/s/${query}/homes?checkin=${startDate}&checkout=${endDate}&adults=${people}`,
    },
  ];
}
