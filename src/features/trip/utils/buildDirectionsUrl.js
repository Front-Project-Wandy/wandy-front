// 외부 지도 앱의 길찾기 링크 (요구사항 #93). 키가 필요 없는 주소 방식만 쓴다.
// 일본은 구글 지도, 한국은 네이버 지도다 (CLAUDE.md).
// 구글 장소는 약관 때문에 이름을 링크에 담지 않고 좌표만 쓴다. 출발지(from)가 없으면 지도 앱이 현재 위치를 쓴다.
export const buildDirectionsUrl = ({ country, from, to, toName }) => {
  if (country === 'JP') {
    const params = new URLSearchParams({
      api: '1',
      destination: `${to.lat},${to.lng}`,
      travelmode: 'transit',
    });
    if (from) params.set('origin', `${from.lat},${from.lng}`);
    return `https://www.google.com/maps/dir/?${params.toString()}`;
  }
  const start = from ? `${from.lng},${from.lat},${encodeURIComponent('내 위치')}` : '-';
  const end = `${to.lng},${to.lat},${encodeURIComponent(toName ?? '')}`;
  return `https://map.naver.com/p/directions/${start}/${end}/-/transit`;
};
