import { useQuery } from '@tanstack/react-query';
import { AMENITY_RADIUS_M, getNearbyAmenities } from '../../../services/amenityService';

// 기준 장소 주변 편의점·화장실·코인락커 (73). 종류마다 가장 가까운 1곳.
export function useNearbyAmenities(place, radius = AMENITY_RADIUS_M) {
  return useQuery({
    queryKey: ['nearbyAmenities', place?.id, radius],
    queryFn: () => getNearbyAmenities({ city: place.city, lat: place.lat, lng: place.lng, radius }),
    enabled: Boolean(place),
    staleTime: 5 * 60 * 1000,
  });
}
