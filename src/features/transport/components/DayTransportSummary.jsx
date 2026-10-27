import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCost, formatDuration } from '../utils/formatTransport';
import { summarizeDayTransport } from '../utils/summarizeDayTransport';

// 한 DAY의 총 이동 시간과 예상 비용 한 줄 (39). 계산할 수 있는 구간이 없으면 아무것도 그리지 않는다.
// 모두 도보라서 비용이 0이면 시간만 보여 준다.
export default function DayTransportSummary({ items, country, transportMode }) {
  const { t, i18n } = useTranslation();
  const summary = useMemo(
    () => summarizeDayTransport({ items, country, transportMode }),
    [items, country, transportMode],
  );
  if (!summary) return null;

  const duration = formatDuration(t, summary.minutes);
  const text =
    summary.cost > 0
      ? t('planner.day.transportTotalWithCost', {
          duration,
          cost: formatCost(t, i18n.language, country, summary.cost),
        })
      : t('planner.day.transportTotal', { duration });

  return <p className="text-body-sm text-text/70">{text}</p>;
}
