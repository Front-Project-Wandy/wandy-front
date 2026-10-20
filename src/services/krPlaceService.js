// 한국 장소: 검색 = 네이버 지역검색, 추천 = TourAPI. 원본 응답을 Place로 바꾸는 것까지 여기서 한다.
import { createPlace } from '../features/search/place';
import { filterPlaces } from '../features/search/utils/filterPlaces';
import naverData from '../mocks/places/kr_naver.json';
import tourData from '../mocks/places/kr_tour.json';

// 네이버 분류 글자(예: '음식점>한식>삼계탕')에 들어 있는 단어로 카테고리를 정한다. 위에 있는 규칙이 먼저.
const NAVER_CATEGORY_RULES = [
  ['cafe', ['카페']],
  ['night', ['술집', '야경', '전망대']],
  ['food', ['음식점']],
  ['onsen', ['찜질방', '온천', '스파']],
  ['shop', ['쇼핑']],
  ['nature', ['공원', '숲', '하천', '호수']],
];

// TourAPI contenttypeid: 39 음식점, 38 쇼핑 / cat1 A01 = 자연
const TOUR_TYPE_CATEGORY = { 39: 'food', 38: 'shop' };

export function getNaverCategory(categoryText = '') {
  const rule = NAVER_CATEGORY_RULES.find(([, words]) =>
    words.some((word) => categoryText.includes(word)),
  );
  return rule ? rule[0] : 'sight';
}

export function getNaverMapUrl(name) {
  return `https://map.naver.com/p/search/${encodeURIComponent(name)}`;
}

// 네이버 검색 결과 제목에는 <b> 태그가 섞여 온다.
const stripTags = (text) => text.replace(/<[^>]*>/g, '');

// 네이버 지역검색은 고유 ID가 없어서 '이름_좌표'로 만든다. mapx/mapy = 경위도 x 1e7
export function toPlaceFromNaver(item, city) {
  const name = stripTags(item.title);
  return createPlace({
    id: `naver:${name}_${item.mapx}_${item.mapy}`,
    source: 'naver',
    sourceId: null,
    name,
    country: 'KR',
    city,
    category: getNaverCategory(item.category),
    lat: Number(item.mapy) / 1e7,
    lng: Number(item.mapx) / 1e7,
    address: item.roadAddress || item.address,
    externalUrl: getNaverMapUrl(name),
  });
}

export function toPlaceFromTour(item, city) {
  const category =
    TOUR_TYPE_CATEGORY[item.contenttypeid] ?? (item.cat1 === 'A01' ? 'nature' : 'sight');
  return createPlace({
    id: `tour:${item.contentid}`,
    source: 'tour',
    sourceId: item.contentid,
    name: item.title,
    country: 'KR',
    city,
    category,
    lat: Number(item.mapy),
    lng: Number(item.mapx),
    address: item.addr1,
    imageUrl: item.firstimage || null,
    externalUrl: getNaverMapUrl(item.title),
  });
}

const getNaverEntries = (city) =>
  (naverData[city] ?? []).map((item) => ({
    place: toPlaceFromNaver(item, city),
    searchText: item.category,
  }));

const getTourEntries = (city) =>
  (tourData[city] ?? []).map((item) => ({ place: toPlaceFromTour(item, city) }));

export function searchKrPlaces({ city, keyword, category }) {
  return filterPlaces(getNaverEntries(city), { keyword, category });
}

export function recommendKrPlaces({ city, category }) {
  return filterPlaces(getTourEntries(city), { category });
}

export function findKrPlace(id) {
  const cities = new Set([...Object.keys(naverData), ...Object.keys(tourData)]);
  for (const city of cities) {
    const entry = [...getNaverEntries(city), ...getTourEntries(city)].find(
      ({ place }) => place.id === id,
    );
    if (entry) return entry.place;
  }
  return null;
}
