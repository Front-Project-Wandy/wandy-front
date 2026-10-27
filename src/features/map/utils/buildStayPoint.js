// 숙소를 지도에 그릴 모양 { lat, lng, name }으로 바꾼다. 좌표가 없으면 지도에서만 빠지도록 null을 돌려준다.
export const buildStayPoint = (stay) =>
  Number.isFinite(stay?.lat) && Number.isFinite(stay?.lng)
    ? { lat: stay.lat, lng: stay.lng, name: stay.name ?? '' }
    : null;
