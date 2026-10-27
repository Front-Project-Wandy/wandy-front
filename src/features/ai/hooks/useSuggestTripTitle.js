import { useMutation } from '@tanstack/react-query';
import { suggestTripTitle } from '../../../services/aiService';

// 여행 제목 추천 (78). [AI 제목 추천]을 눌렀을 때만 부른다 — 2단계에서는 부를 때마다 Gemini 비용이 들어서다.
// mutate(conditions) → data: { titles: string[] }
export function useSuggestTripTitle() {
  return useMutation({ mutationFn: suggestTripTitle });
}
