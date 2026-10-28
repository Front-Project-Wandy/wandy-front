// 일본 장소: Google Places (New). 약관상 구글 장소 내용은 저장하지 않고 화면에 보여주기만 한다.
import { createPlace } from '../features/search/place';
import { filterPlaces } from '../features/search/utils/filterPlaces';
import googleData from '../mocks/places/jp_google.json';
import { withPlacePhoto } from './placePhotoService';

// primaryType → [카테고리, 검색어로 찾을 수 있는 한국어]
const GOOGLE_TYPES = {
  buddhist_temple: ['sight', '절 사원'],
  shinto_shrine: ['sight', '신사'],
  tourist_attraction: ['sight', '관광 명소'],
  museum: ['sight', '박물관 미술관'],
  japanese_restaurant: ['food', '일식 식당'],
  ramen_restaurant: ['food', '라멘 식당'],
  sushi_restaurant: ['food', '스시 초밥 식당'],
  food_court: ['food', '시장 식당'],
  cafe: ['cafe', '카페'],
  coffee_shop: ['cafe', '카페 커피'],
  dessert_shop: ['cafe', '디저트 카페'],
  market: ['shop', '시장 쇼핑'],
  shopping_mall: ['shop', '쇼핑몰'],
  park: ['nature', '공원'],
  garden: ['nature', '정원 공원'],
  observation_deck: ['night', '전망대 야경'],
  bar: ['night', '술집 이자카야'],
  spa: ['onsen', '온천 스파'],
};

const getTypeInfo = (primaryType) => GOOGLE_TYPES[primaryType] ?? ['sight', ''];

// 음식 종류 (44): 먹고 마시는 곳이 아니면 null, 세부 종류를 모르는 식당은 'other'.
const GOOGLE_FOOD_TYPES = {
  korean_restaurant: 'korean',
  ramen_restaurant: 'ramen',
  sushi_restaurant: 'sushi',
  cafe: 'cafe',
  coffee_shop: 'cafe',
  dessert_shop: 'dessert',
  bakery: 'dessert',
  bar: 'bar',
  pub: 'bar',
};

export function getGoogleFoodType(primaryType = '') {
  if (GOOGLE_FOOD_TYPES[primaryType]) return GOOGLE_FOOD_TYPES[primaryType];
  if (primaryType === 'restaurant' || primaryType.endsWith('_restaurant')) return 'other';
  if (primaryType === 'food_court') return 'other';
  return null;
}

export function getGoogleMapsUrl(name, placeId) {
  const query = encodeURIComponent(name);
  return `https://www.google.com/maps/search/?api=1&query=${query}&query_place_id=${placeId}`;
}

export function toPlaceFromGoogle(item, city) {
  const name = item.displayName?.text ?? '';
  const place = createPlace({
    id: `google:${item.id}`,
    source: 'google',
    sourceId: item.id,
    name,
    country: 'JP',
    city,
    category: getTypeInfo(item.primaryType)[0],
    lat: item.location.latitude,
    lng: item.location.longitude,
    address: item.formattedAddress,
    // 사진은 Place Photos API로 따로 받아야 해서 1단계 더미에서는 비우고, 아래에서 직접 고른 사진으로 채운다.
    imageUrl: null,
    rating: item.rating ?? null,
    openingHours: item.regularOpeningHours?.weekdayDescriptions ?? null,
    externalUrl: getGoogleMapsUrl(name, item.id),
  });
  return withPlacePhoto(place);
}

const getGoogleEntries = (city) =>
  (googleData[city] ?? []).map((item) => ({
    place: toPlaceFromGoogle(item, city),
    searchText: getTypeInfo(item.primaryType)[1],
    popularity: (item.rating ?? 0) * Math.log10((item.userRatingCount ?? 0) + 1),
  }));

// 주변 맛집용: 먹고 마시는 곳만 [{ place, foodType }]
export function listJpEatEntries(city) {
  return (googleData[city] ?? [])
    .map((item) => ({
      place: toPlaceFromGoogle(item, city),
      foodType: getGoogleFoodType(item.primaryType),
    }))
    .filter(({ foodType }) => foodType !== null);
}

export function searchJpPlaces({ city, keyword, category }) {
  return filterPlaces(getGoogleEntries(city), { keyword, category });
}

// 추천 = 평점과 리뷰 수를 같이 본 인기순
export function recommendJpPlaces({ city, category }) {
  const entries = [...getGoogleEntries(city)].sort((a, b) => b.popularity - a.popularity);
  return filterPlaces(entries, { category });
}

export function findJpPlace(id) {
  for (const city of Object.keys(googleData)) {
    const entry = getGoogleEntries(city).find(({ place }) => place.id === id);
    if (entry) return entry.place;
  }
  return null;
}
