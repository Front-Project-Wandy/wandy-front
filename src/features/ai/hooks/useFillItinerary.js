import { useMutation } from '@tanstack/react-query';
import { fillItinerary } from '../../../services/aiService';
import { getCityPlaces, withSamePlaceIds } from '../../../services/placeService';
import { usePlaceRatingStore } from '../../member/hooks/usePlaceRatingStore';
import { getRatedPlaceIds } from '../../search/utils/applyPlaceRatings';
import { validateItinerary } from '../utils/validateItinerary';

// 다녀온 장소 평가(97)를 요청 조건에 더한다. 좋았던 곳은 먼저 고르고(likedPlaceIds), 별로였던 곳은 넣지 않는다.
// 플래너·마법사·한 줄 요청이 모두 이 훅을 거쳐서, 조건을 만드는 쪽은 평가를 몰라도 된다.
const withPlaceRatings = (conditions) => {
  const { ratings } = usePlaceRatingStore.getState();
  return {
    ...conditions,
    likedPlaceIds: getRatedPlaceIds(ratings, 'like'),
    excludePlaceIds: [
      ...(conditions.excludePlaceIds ?? []),
      ...getRatedPlaceIds(ratings, 'dislike'),
    ],
  };
};

// 빈 일정 자동 채우기 (55). 버튼을 눌렀을 때만 부르는 요청이라 useQuery가 아니라 useMutation이다.
// mutate(conditions) → data: { days: [{ dayIndex, items: [{ place, startTime, stayMinutes }] }], droppedCount }
// 결과는 바로 저장하지 않는다. 화면에서 미리 보여 주고, 사용자가 고르면 플랜 store에 넣는다.
export function useFillItinerary() {
  return useMutation({
    mutationFn: async (baseConditions) => {
      const rated = withPlaceRatings(baseConditions);
      const candidates = await getCityPlaces(rated);
      // 검색으로 넣은 장소는 후보와 id가 다를 수 있어서(네이버 ↔ TourAPI) 같은 장소의 후보 id까지 넓힌다.
      // 넓히지 않으면 이미 넣은 경복궁을 AI가 다시 넣는다.
      const [excludePlaceIds, likedPlaceIds] = await Promise.all([
        withSamePlaceIds(rated.excludePlaceIds, candidates),
        withSamePlaceIds(rated.likedPlaceIds, candidates),
      ]);
      const conditions = { ...rated, excludePlaceIds, likedPlaceIds };
      const raw = await fillItinerary(conditions);
      return validateItinerary(raw, candidates, {
        excludePlaceIds: conditions.excludePlaceIds,
        dayCount: conditions.days?.length,
        dayDates: conditions.days?.map((day) => day.date),
        flight: conditions.flight,
      });
    },
  });
}
