import heroCarousel from '../../mocks/heroCarousel.json';
import placePhotos from '../../mocks/placePhotos.json';
import { CITY_PHOTOS } from './cityPhotos';

// 홈 히어로 캐러셀 사진 (서울·도쿄를 번갈아). 고른 목록은 src/mocks/heroCarousel.json에 두고,
// 사진 경로·출처는 이미 라이선스를 확인한 장소 사진(placePhotos.json)·도시 사진(cityPhotos.js)에서 가져온다.
// 장소 사진은 그 장소 상세로, 도시 사진은 그 도시 장소 탐색으로 간다.
const COUNTRY_BY_CITY = { seoul: 'KR', tokyo: 'JP' };

const toItem = (entry) => {
  const photo = entry.placeId ? placePhotos[entry.placeId] : CITY_PHOTOS[entry.city];
  return {
    src: entry.placeId ? photo.src : `/images/home/${entry.city}.jpg`,
    alt: entry.alt,
    title: entry.title,
    city: entry.city,
    link: entry.placeId
      ? `/place/${encodeURIComponent(entry.placeId)}`
      : `/places?country=${COUNTRY_BY_CITY[entry.city]}&city=${entry.city}`,
    credit: {
      author: photo.author,
      source: photo.source,
      license: photo.license,
      licenseUrl: photo.licenseUrl,
    },
  };
};

export const HERO_CAROUSEL_ITEMS = heroCarousel.map(toItem);
