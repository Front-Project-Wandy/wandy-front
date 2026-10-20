import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getRecommendedPlaces, searchPlaces } from '../../../services/placeService';

// 키워드가 비어 있으면 도시별 추천(9), 있으면 키워드 검색(7). 카테고리(8)는 둘 다에 적용.
export function usePlaceSearch({ country, city, keyword, category }) {
  const word = keyword.trim();
  const mode = word ? 'search' : 'recommend';

  const query = useQuery({
    queryKey: ['places', mode, country, city, word, category],
    queryFn: () =>
      mode === 'search'
        ? searchPlaces({ country, city, keyword: word, category })
        : getRecommendedPlaces({ country, city, category }),
    // 다음 결과가 올 때까지 이전 목록을 보여줘서 글자를 칠 때마다 화면이 깜빡이지 않게 한다.
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });

  return { ...query, mode };
}
