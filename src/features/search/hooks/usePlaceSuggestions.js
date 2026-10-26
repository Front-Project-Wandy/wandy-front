import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { autocompletePlaces } from '../../../services/placeService';

const NO_SUGGESTIONS = [];

// 검색 자동완성 후보(43). 검색어가 비어 있으면 요청하지 않는다.
// 세션 토큰: 구글 자동완성은 입력부터 후보 선택까지를 한 번으로 쳐서 요금을 매긴다(2단계).
// 후보를 고르면 endSession()으로 새 토큰을 만들어 다음 입력을 새 세션으로 시작한다.
// 토큰은 캐시 키에 넣지 않는다 — 같은 검색어 후보는 세션이 바뀌어도 같다.
export function usePlaceSuggestions({ country, city, keyword }) {
  const word = keyword.trim();
  const [sessionToken, setSessionToken] = useState(() => crypto.randomUUID());

  // 글자를 더 칠 때 후보가 깜빡이지 않게 이전 후보를 보여 준다. 여행지가 바뀌면 이전 후보는 버린다.
  const keepSameTripData = (previousData, previousQuery) => {
    const [, previousCountry, previousCity] = previousQuery?.queryKey ?? [];
    return previousCountry === country && previousCity === city ? previousData : undefined;
  };

  const { data } = useQuery({
    queryKey: ['placeSuggestions', country, city, word],
    queryFn: () => autocompletePlaces({ country, city, keyword: word, sessionToken }),
    enabled: Boolean(word),
    placeholderData: keepSameTripData,
    staleTime: 5 * 60 * 1000,
  });

  const endSession = useCallback(() => setSessionToken(crypto.randomUUID()), []);

  return { suggestions: word ? (data ?? NO_SUGGESTIONS) : NO_SUGGESTIONS, endSession };
}
