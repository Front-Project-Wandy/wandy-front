import { useTranslation } from 'react-i18next';
import { useOpeningHoursWarning } from '../hooks/useOpeningHoursWarning';

// 방문 시각이 영업시간 밖이면 한 줄로 알려 준다 (74). 알려 주기만 하고 시각은 바꾸지 않는다.
// 플래너 DayItem(C)의 다른 경고 줄(시간 순서·항공 시각)과 같은 모양이다.
// <OpeningHoursWarning placeId={item.placeId} date={day.date} startTime={item.startTime} stayMinutes={item.stayMinutes} />
export default function OpeningHoursWarning({ placeId, date, startTime, stayMinutes }) {
  const { t } = useTranslation();
  const warning = useOpeningHoursWarning({ placeId, date, startTime, stayMinutes });
  if (!warning) return null;

  return (
    <span className="block text-body-sm font-bold text-text">
      {t(`place.hoursWarning.${warning.status}`, { hours: warning.hours })}
    </span>
  );
}
