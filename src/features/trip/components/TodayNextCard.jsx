import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import { estimateTransport } from '../../transport/utils/estimateTransport';
import { formatDistance, formatDuration } from '../../transport/utils/formatTransport';
import { getDistanceMeters } from '../../transport/utils/distance';
import { useCurrentPosition } from '../hooks/useCurrentPosition';
import { useItemName } from '../hooks/useItemName';
import { buildDirectionsUrl } from '../utils/buildDirectionsUrl';

// 오늘 일정 맨 위의 「다음 일정」 카드 (요구사항 #93): 시작까지 남은 시간, 내 위치에서의 거리, 길찾기.
// 길찾기는 외부 지도 앱 링크로 연다. 위치를 못 받아도 도착지만 넣은 링크로 열어 지도 앱이 현재 위치를 쓰게 한다.
export default function TodayNextCard({ item, minutesUntil, country, transportMode }) {
  const { t } = useTranslation();
  const name = useItemName(item);
  const { status, position, request } = useCurrentPosition();

  const handleDirections = () => {
    const url = buildDirectionsUrl({
      country,
      from: position,
      to: item,
      toName: country === 'KR' ? name : null,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const renderUntil = () => {
    if (minutesUntil === null) return null;
    if (minutesUntil === 0) return t('planner.today.untilNow');
    return minutesUntil > 0
      ? t('planner.today.until', { duration: formatDuration(t, minutesUntil) })
      : t('planner.today.overdue', { duration: formatDuration(t, -minutesUntil) });
  };

  const renderPosition = () => {
    if (status === 'ready') {
      const leg = estimateTransport({ from: position, to: item, country, transportMode });
      const meters = getDistanceMeters(position, item);
      return leg
        ? t('planner.today.distance', {
            distance: formatDistance(meters),
            mode: t(`planner.transport.mode.${leg.mode}`),
            duration: formatDuration(t, leg.minutes),
          })
        : t('planner.today.distanceOnly', { distance: formatDistance(meters) });
    }
    if (status === 'loading') return t('planner.today.locating');
    if (status === 'idle') return null;
    return t(`planner.today.position.${status}`);
  };

  return (
    <section
      aria-label={t('planner.today.next')}
      className="space-y-2 rounded-2xl border border-primary bg-bg-soft p-4"
    >
      <p className="text-body-sm font-bold text-primary">{t('planner.today.next')}</p>
      <p className="text-subtitle font-bold break-keep">{name}</p>
      <p className="text-body-sm">
        {item.startTime} {renderUntil() ? `· ${renderUntil()}` : ''}
      </p>
      {renderPosition() ? (
        <p className="text-body-sm text-text/70" aria-live="polite">
          {renderPosition()}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2 pt-1">
        <Button variant="secondary" size="sm" loading={status === 'loading'} onClick={request}>
          {t('planner.today.locate')}
        </Button>
        <Button size="sm" onClick={handleDirections}>
          {t('planner.today.directions')}
        </Button>
      </div>
    </section>
  );
}
