const hasCoords = (place) => Number.isFinite(place?.lat) && Number.isFinite(place?.lng);

// 우리 이동 수단 → 각 지도의 길찾기 수단. 택시와 자차는 둘 다 자동차 길찾기로 연다.
const NAVER_MODES = { walk: 'walk', transit: 'transit', taxi: 'car', car: 'car' };
const GOOGLE_MODES = { walk: 'walking', transit: 'transit', taxi: 'driving', car: 'driving' };

// 네이버는 출발·도착을 "경도,위도,이름" 순서로 주소에 넣는다. 이름이 없는 장소는 비워 둔다.
const toNaverPoint = ({ lat, lng, name }) => [lng, lat, encodeURIComponent(name ?? '')].join(',');

// 앞 장소(from)에서 다음 장소(to)까지 지도 앱 길찾기를 여는 주소를 만든다.
// KR은 네이버 지도, JP는 구글 지도. 좌표가 없거나 지원하지 않는 나라·수단이면 null.
// 구글 장소는 약관상 이름을 저장하지 않아서 구글 주소에는 좌표만 쓴다.
export const buildDirectionsUrl = ({ from, to, country, mode }) => {
  if (!hasCoords(from) || !hasCoords(to)) return null;

  if (country === 'KR' && NAVER_MODES[mode]) {
    return `https://map.naver.com/p/directions/${toNaverPoint(from)}/${toNaverPoint(to)}/-/${NAVER_MODES[mode]}`;
  }
  if (country === 'JP' && GOOGLE_MODES[mode]) {
    const params = new URLSearchParams({
      api: '1',
      origin: `${from.lat},${from.lng}`,
      destination: `${to.lat},${to.lng}`,
      travelmode: GOOGLE_MODES[mode],
    });
    return `https://www.google.com/maps/dir/?${params}`;
  }
  return null;
};
