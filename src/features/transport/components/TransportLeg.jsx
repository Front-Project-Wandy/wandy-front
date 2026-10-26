import { useTranslation } from 'react-i18next';
import { estimateTransport } from '../utils/estimateTransport';
import { formatAmount, splitMinutes } from '../utils/formatTransport';

// 앞 장소(from)에서 다음 장소(to)까지의 이동 수단·시간·비용 한 줄.
// 좌표가 없어 계산할 수 없으면 아무것도 그리지 않는다.
export default function TransportLeg({ from, to, country, transportMode }) {
  const { t, i18n } = useTranslation();
  const leg = estimateTransport({ from, to, country, transportMode });
  if (!leg) return null;

  const { hours, minutes } = splitMinutes(leg.minutes);
  const duration =
    hours === 0
      ? t('planner.transport.duration.minutes', { minutes })
      : minutes === 0
        ? t('planner.transport.duration.hours', { hours })
        : t('planner.transport.duration.hoursMinutes', { hours, minutes });
  const mode = t(`planner.transport.mode.${leg.mode}`);
  const text =
    leg.cost > 0
      ? t('planner.transport.legWithCost', {
          mode,
          duration,
          cost: t(`planner.transport.currency.${country}`, {
            amount: formatAmount(leg.cost, i18n.language),
          }),
        })
      : t('planner.transport.leg', { mode, duration });

  return <p className="pl-11 text-body-sm text-text/70">{text}</p>;
}
