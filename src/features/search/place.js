// Place — 화면에서 쓰는 공통 장소 객체 (B파트 정의, 공유 계약).
// 네이버·구글·TourAPI 결과는 전부 createPlace로 이 모양을 만들어 넘긴다. 화면은 원본 응답을 직접 쓰지 않는다.

export const PLACE_SOURCES = ['google', 'naver', 'tour'];
export const COUNTRIES = ['KR', 'JP'];
export const PLACE_CATEGORIES = ['sight', 'food', 'cafe', 'shop', 'nature', 'night', 'onsen'];

// 1단계 더미 데이터가 있는 도시 (완성 기준: 서울 1번, 도쿄 1번)
export const CITIES_BY_COUNTRY = { KR: ['seoul'], JP: ['tokyo'] };

export function createPlace(fields) {
  return {
    id: fields.id,
    source: fields.source,
    sourceId: fields.sourceId ?? null,
    name: fields.name,
    country: fields.country,
    city: fields.city,
    category: fields.category,
    lat: fields.lat,
    lng: fields.lng,
    address: fields.address ?? '',
    imageUrl: fields.imageUrl ?? null,
    rating: fields.rating ?? null,
    openingHours: fields.openingHours ?? null,
    externalUrl: fields.externalUrl ?? null,
  };
}

// Place.id에는 한글·쉼표가 들어갈 수 있어서 주소(/place/:id)에 넣을 때는 꼭 인코딩한다.
export function getPlacePath(place) {
  return `/place/${encodeURIComponent(place.id)}`;
}
