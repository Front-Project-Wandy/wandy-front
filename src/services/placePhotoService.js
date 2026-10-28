// 장소 사진 — 1단계 더미 장소에는 사진이 없어서 직접 고른 Wikimedia Commons 사진(src/mocks/placePhotos.json)을 붙인다.
// 출처·라이선스 표시가 필요한 사진이라, 화면은 getPlacePhoto로 작가·라이선스를 함께 받아 보여 준다.
import placePhotos from '../mocks/placePhotos.json';

// Place.id → { src, author, source, license, licenseUrl, representative? } 또는 null
export function getPlacePhoto(placeId) {
  return placePhotos[placeId] ?? null;
}

// 2단계에서 API가 사진을 주면 그 사진이 먼저다 — imageUrl이 비어 있을 때만 채운다.
export function withPlacePhoto(place) {
  if (place.imageUrl) return place;
  const photo = getPlacePhoto(place.id);
  return photo ? { ...place, imageUrl: photo.src } : place;
}
