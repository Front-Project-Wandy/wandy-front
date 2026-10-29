import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getRecommendedPlaces, searchPlaces } from '../../../services/placeService';
import { usePlaceRatingStore } from '../../member/hooks/usePlaceRatingStore';
import { applyPlaceRatings } from '../utils/applyPlaceRatings';
import { prioritizePreferredPlaces } from '../utils/prioritizePreferredPlaces';

const NO_PREFERRED_CATEGORIES = [];

// 키워드가 비어 있으면 도시별 추천(9), 있으면 키워드 검색(7). 카테고리(8)는 둘 다에 적용.
export function usePlaceSearch({
  country,
  city,
  keyword,
  category,
  preferredCategories = NO_PREFERRED_CATEGORIES,
}) {
  const word = keyword.trim();
  const mode = word ? 'search' : 'recommend';

  const ratings = usePlaceRatingStore((state) => state.ratings);

  // 개인화는 추천 표시 순서에만 적용한다. 키워드 검색 순서와 서버 응답 캐시는 그대로 둔다.
  // 선호 카테고리 순으로 정렬한 뒤, 다녀온 장소 평가(97)로 좋았던 곳은 맨 앞, 별로였던 곳은 맨 뒤로 보낸다.
  const selectPlaces = useCallback(
    (places) =>
      mode === 'recommend'
        ? applyPlaceRatings(prioritizePreferredPlaces(places, preferredCategories), ratings)
        : places,
    [mode, preferredCategories, ratings],
  );

  // 같은 여행지에서 검색어·카테고리만 바뀔 때는 다음 결과가 올 때까지 이전 목록을 보여줘서 깜빡이지 않게 한다.
  // 여행지(나라·도시)가 바뀌면 이전 여행지 장소를 고를 수 없도록 이전 목록을 버리고 로딩으로 보낸다.
  const keepSameTripData = (previousData, previousQuery) => {
    const [, , previousCountry, previousCity] = previousQuery?.queryKey ?? [];
    return previousCountry === country && previousCity === city ? previousData : undefined;
  };

  const query = useQuery({
    queryKey: ['places', mode, country, city, word, category],
    queryFn: () =>
      mode === 'search'
        ? searchPlaces({ country, city, keyword: word, category })
        : getRecommendedPlaces({ country, city, category }),
    placeholderData: keepSameTripData,
    select: selectPlaces,
    staleTime: 5 * 60 * 1000,
  });

  return { ...query, mode };
}
