import { getDistanceMeters } from './geo';

// 출처(네이버·TourAPI·구글)가 다르면 같은 장소도 Place.id가 달라서, 이름과 위치로 같은 곳인지 본다.
// 이름이 같아야만 같은 장소로 본다 — 같은 건물에 있는 다른 식당(이름이 다름)은 빼지 않기 위해서다.
// 좌표는 제공사마다 수십 m씩 차이가 나서 완전히 같기를 요구하지 않고, 가깝거나 주소가 같으면 같은 곳으로 본다.
export const SAME_PLACE_MAX_DISTANCE_M = 50;

const normalizeName = (name = '') =>
  name
    .replace(/<[^>]*>/g, '')
    .replace(/[\s·・()（）[\]\-_.]/g, '')
    .toLowerCase();

const normalizeAddress = (address = '') => address.replace(/\s+/g, '');

export function isSamePlace(a, b) {
  if (a.id === b.id) return true;
  if (a.country !== b.country) return false;
  if (!normalizeName(a.name) || normalizeName(a.name) !== normalizeName(b.name)) return false;
  const sameAddress =
    Boolean(a.address) && normalizeAddress(a.address) === normalizeAddress(b.address);
  return sameAddress || getDistanceMeters(a, b) <= SAME_PLACE_MAX_DISTANCE_M;
}
