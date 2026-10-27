// 장소 주변 편의시설 (73) — 편의점·화장실·코인락커. 실제 API가 없어서 도시별 목업 목록에서 고른다.
import { getDistanceMeters } from '../features/search/utils/geo';
import amenityData from '../mocks/amenities.json';
import { mockRequest } from './api/mockRequest';

export const AMENITY_TYPES = ['convenience', 'toilet', 'locker'];

// 500m ≈ 걸어서 7분. 편의시설은 구경하다 잠깐 들르는 곳이라 주변 식당(1km)보다 좁게 잡았다.
// 이보다 멀면 일부러 찾아가야 해서 "근처"라고 보여 주기 어렵다.
export const AMENITY_RADIUS_M = 500;

// 기준 좌표에서 종류마다 가장 가까운 1곳 → [{ type, amenity, distance }] (AMENITY_TYPES 순서, distance 단위 m)
// 반경 안에 그 종류가 없으면 amenity·distance가 null이다. 목업이 없는 도시는 전부 null.
export function getNearbyAmenities({ city, lat, lng, radius = AMENITY_RADIUS_M }) {
  return mockRequest(() => {
    const inRadius = (amenityData[city] ?? [])
      .map((amenity) => ({ amenity, distance: getDistanceMeters({ lat, lng }, amenity) }))
      .filter(({ distance }) => distance <= radius)
      .sort((a, b) => a.distance - b.distance);
    return AMENITY_TYPES.map((type) => {
      const nearest = inRadius.find(({ amenity }) => amenity.type === type);
      return { type, amenity: nearest?.amenity ?? null, distance: nearest?.distance ?? null };
    });
  });
}
