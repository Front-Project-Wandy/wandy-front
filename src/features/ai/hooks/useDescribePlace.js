import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { describePlace } from '../../../services/aiService';

// 장소 한 줄 설명 (78). 상세 화면을 열 때 부른다 → data: { description }
// 같은 장소·언어면 다시 만들지 않고(2단계 Gemini 비용), 실패해도 다시 시도하지 않는다 — 없어도 되는 보조 정보라서.
export function useDescribePlace(place) {
  const { i18n } = useTranslation();
  return useQuery({
    queryKey: ['ai', 'placeDescription', place?.id, i18n.language],
    queryFn: () => describePlace(place),
    enabled: Boolean(place),
    staleTime: Infinity,
    retry: false,
  });
}
