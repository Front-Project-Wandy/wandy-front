import { useQuery } from '@tanstack/react-query';
import { getRecommendedPlaces, searchPlaces } from '../../../services/placeService';

// 키워드가 비어 있으면 도시별 추천(9), 있으면 키워드 검색(7). 카테고리(8)는 둘 다에 적용.
export function usePlaceSearch({ country, city, keyword, category }) {
  const word = keyword.trim();
  const mode = word ? 'search' : 'recommend';

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
    staleTime: 5 * 60 * 1000,
  });

  return { ...query, mode };
}
