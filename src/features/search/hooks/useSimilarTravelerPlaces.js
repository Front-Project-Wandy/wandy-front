import { useQuery } from '@tanstack/react-query';
import { getSimilarTravelerPlaces } from '../../../services/recommendService';
import { usePlaceRatingStore } from '../../member/hooks/usePlaceRatingStore';
import { getRatedPlaceIds } from '../utils/applyPlaceRatings';

// 비슷한 성향 여행자들이 많이 간 장소 (102). 다녀온 곳 평가(97)에서 좋았던 곳도 함께 넘겨
// 그곳을 다녀간 여행자를 더 비슷하게 본다. 이미 담은 장소(excludePlaceIds)는 추천에서 뺀다.
export function useSimilarTravelerPlaces({ country, city, profile, excludePlaceIds }) {
  const ratings = usePlaceRatingStore((state) => state.ratings);
  const likedPlaceIds = getRatedPlaceIds(ratings, 'like');
  const { style, companion, budget, preferredCategories } = profile;

  return useQuery({
    queryKey: [
      'similarTravelerPlaces',
      country,
      city,
      { style, companion, budget, preferredCategories },
      likedPlaceIds,
      excludePlaceIds,
    ],
    queryFn: () =>
      getSimilarTravelerPlaces({
        country,
        city,
        profile: { style, companion, budget, preferredCategories },
        likedPlaceIds,
        excludePlaceIds,
      }),
    enabled: Boolean(country && city),
    // 장소를 담을 때마다 목록이 비지 않게 앞의 결과를 보여 둔 채 다시 계산한다
    placeholderData: (previous) => previous,
  });
}
