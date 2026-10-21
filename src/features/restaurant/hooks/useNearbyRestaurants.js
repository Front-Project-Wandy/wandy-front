import { useQuery } from '@tanstack/react-query';
import { getNearbyRestaurants, NEARBY_RADIUS_M } from '../../../services/placeService';
import { isSamePlace } from '../../search/utils/samePlace';

// 기준 장소 반경 안의 식당 (22). 기준 장소와 같은 곳은 출처가 달라도(예: TourAPI 광장시장 ↔ 네이버 광장시장) 뺀다.
export function useNearbyRestaurants(place, radius = NEARBY_RADIUS_M) {
  return useQuery({
    queryKey: ['nearbyRestaurants', place?.id, radius],
    queryFn: () =>
      getNearbyRestaurants({
        country: place.country,
        city: place.city,
        lat: place.lat,
        lng: place.lng,
        radius,
      }),
    enabled: Boolean(place),
    staleTime: 5 * 60 * 1000,
    select: (items) => items.filter((item) => !isSamePlace(item.place, place)),
  });
}
