import { useTranslation } from 'react-i18next';
import { buildDirectionsUrl } from '../utils/buildDirectionsUrl';
import { estimateTransport } from '../utils/estimateTransport';
import { formatCost, formatDuration } from '../utils/formatTransport';

// 앞 장소(from)에서 다음 장소(to)까지의 이동 수단·시간·비용 한 줄.
// 좌표가 없어 계산할 수 없으면 아무것도 그리지 않는다.
// showDirections: 지도 앱 길찾기 링크를 같이 보여 준다 (42). 플래너만 켜고, 마법사 화면은 그대로 둔다.
export default function TransportLeg({
  from,
  to,
  country,
  transportMode,
  showDirections = false,
  className = 'pl-11',
}) {
  const { t, i18n } = useTranslation();
  const leg = estimateTransport({ from, to, country, transportMode });
  if (!leg) return null;

  const duration = formatDuration(t, leg.minutes);
  const mode = t(`planner.transport.mode.${leg.mode}`);
  const legText =
    leg.cost > 0
      ? t('planner.transport.legWithCost', {
          mode,
          duration,
          cost: formatCost(t, i18n.language, country, leg.cost),
        })
      : t('planner.transport.leg', { mode, duration });

  const text =
    leg.nightSurcharge > 0 ? t('planner.transport.withNightSurcharge', { text: legText }) : legText;

  const directionsUrl = showDirections
    ? buildDirectionsUrl({ from, to, country, mode: leg.mode })
    : null;

  return (
    <p className={`${className} flex flex-wrap items-center gap-x-3 text-body-sm text-text/70`}>
      <span>{text}</span>
      {directionsUrl ? (
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('planner.transport.directionsLabel')}
          className="rounded-sm text-link underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t('planner.transport.directions')}
          <span aria-hidden="true"> ↗</span>
        </a>
      ) : null}
    </p>
  );
}
