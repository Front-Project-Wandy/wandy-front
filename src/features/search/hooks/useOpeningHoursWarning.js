import { checkVisitHours } from '../utils/openingHours';
import { usePlace } from './usePlace';

// 플랜 item 하나의 영업시간 경고 (74). → null | { status: 'closed' } | { status: 'outside', hours }
// 영업시간은 구글(JP) 장소에만 있어서 구글 장소만 placeId로 다시 불러온다 (장소 상세와 같은 캐시).
// 경고 줄을 넣을지(DayItem의 hasDetails 같은 조건)를 정해야 하는 화면은 이 훅을, 줄만 필요하면
// OpeningHoursWarning 컴포넌트를 쓴다.
export function useOpeningHoursWarning({ placeId, date, startTime, stayMinutes }) {
  const isGoogle = typeof placeId === 'string' && placeId.startsWith('google:');
  const { data: place } = usePlace(isGoogle ? placeId : null);
  if (!place) return null;
  return checkVisitHours({ openingHours: place.openingHours, date, startTime, stayMinutes });
}
