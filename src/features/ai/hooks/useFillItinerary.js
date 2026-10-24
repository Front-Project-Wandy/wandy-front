import { useMutation } from '@tanstack/react-query';
import { fillItinerary } from '../../../services/aiService';
import { getCityPlaces } from '../../../services/placeService';
import { validateItinerary } from '../utils/validateItinerary';

// 빈 일정 자동 채우기 (55). 버튼을 눌렀을 때만 부르는 요청이라 useQuery가 아니라 useMutation이다.
// mutate(conditions) → data: { days: [{ dayIndex, items: [{ place, startTime, stayMinutes }] }], droppedCount }
// 결과는 바로 저장하지 않는다. 화면에서 미리 보여 주고, 사용자가 고르면 플랜 store에 넣는다.
export function useFillItinerary() {
  return useMutation({
    mutationFn: async (conditions) => {
      const [raw, candidates] = await Promise.all([
        fillItinerary(conditions),
        getCityPlaces(conditions),
      ]);
      return validateItinerary(raw, candidates, {
        excludePlaceIds: conditions.excludePlaceIds,
        dayCount: conditions.days?.length,
      });
    },
  });
}
