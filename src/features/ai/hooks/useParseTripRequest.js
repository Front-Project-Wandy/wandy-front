import { useMutation } from '@tanstack/react-query';
import { parseTripRequest } from '../../../services/aiService';
import { normalizeTripRequest } from '../utils/normalizeTripRequest';

// 한 줄 요청 해석 (56). [알아보기]를 눌렀을 때만 부른다 — 2단계에서는 글자마다 Gemini를 부르면 비용이 커서다.
// mutate(text) → data: { country, city, isCityAvailable, days, people, style, preferredCategories, companion }
export function useParseTripRequest() {
  return useMutation({
    mutationFn: async (text) => normalizeTripRequest(await parseTripRequest(text)),
  });
}
