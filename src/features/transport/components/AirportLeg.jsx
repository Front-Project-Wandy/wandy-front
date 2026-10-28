import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { estimateAirportLeg } from '../utils/estimateAirportLeg';
import { formatCost, formatDuration } from '../utils/formatTransport';

// 도착 공항에서 숙소까지의 이동 한 줄 (52): 「하네다공항 → 숙소(이름) · 대중교통 35분 · 약 1,060엔」.
// 일정 장소(item)가 아니라 구간 줄로만 보여 줘서 저장·드래그·지도·합계에는 들어가지 않는다.
// 항공 정보나 좌표 있는 숙소가 없으면 그리지 않는다. 도착 공항을 모르면 도시 대표 공항 기준임을 알린다.
export default function AirportLeg({ trip }) {
  const { t, i18n } = useTranslation();
  const { flight, stay, city, country, transportMode } = trip;
  const leg = useMemo(
    () => estimateAirportLeg({ flight, stay, city, country, transportMode }),
    [flight, stay, city, country, transportMode],
  );
  if (!leg) return null;

  const airport = t(`planner.airportLeg.airport.${leg.airportCode}`);
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

  return (
    <section aria-label={t('planner.airportLeg.title')} className="space-y-1">
      <p className="text-body-sm">
        <span aria-hidden="true">✈ </span>
        {t('planner.airportLeg.route', { airport, stay: stay.name })} · {text}
      </p>
      {leg.isAssumed ? (
        <p className="text-body-sm text-text/70">{t('planner.airportLeg.assumed', { airport })}</p>
      ) : null}
    </section>
  );
}
