import { CITIES_BY_COUNTRY } from '../../features/search/place';

// 홈 인기 도시 카드 (61) — 와이어프레임 H01 순서.
export const POPULAR_CITIES = [
  { country: 'KR', city: 'seoul' },
  { country: 'KR', city: 'busan' },
  { country: 'KR', city: 'jeju' },
  { country: 'JP', city: 'tokyo' },
  { country: 'JP', city: 'osaka' },
  { country: 'JP', city: 'fukuoka' },
];

// 장소 데이터가 있는 도시만 마법사를 시작할 수 있다. B파트가 CITIES_BY_COUNTRY에 도시를 더하면 자동으로 열린다.
export const isCityAvailable = ({ country, city }) =>
  CITIES_BY_COUNTRY[country]?.includes(city) ?? false;
