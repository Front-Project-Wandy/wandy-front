import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getCityPlaces } from '../../../services/placeService';
import { usePlanStore } from '../../../store/plan/usePlanStore';
import { findGapSuggestions } from '../utils/findGapSuggestions';

// 한 DAY의 빈 시간대 추천 (요구사항 #77). 장소가 2곳 이상일 때만 후보를 불러온다.
// 일정 전체와 선호 카테고리는 스토어에서 읽어서, 화면에는 DAY 번호만 넘기면 된다.
export function useGapSuggestions(dayIndex) {
  const trip = usePlanStore((state) => state.trip);
  const day = trip?.days[dayIndex];
  const isEnabled = Boolean(day && day.items.length >= 2 && trip.country && trip.city);

  const {
    data: candidates,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['gapCandidates', trip?.country, trip?.city],
    queryFn: () => getCityPlaces({ country: trip.country, city: trip.city }),
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000,
  });

  const gaps = useMemo(() => {
    if (!isEnabled || !candidates) return [];
    return findGapSuggestions({
      day,
      plannedItems: trip.days.flatMap((tripDay) => tripDay.items),
      candidates,
      country: trip.country,
      transportMode: trip.transportMode,
      preferredCategories: trip.preferredCategories ?? [],
    });
  }, [isEnabled, candidates, day, trip]);

  return { gaps, isEnabled, isLoading, isError, refetch };
}
