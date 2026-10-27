import { useTranslation } from 'react-i18next';
import { compareTransport } from '../utils/compareTransport';
import { formatCost, formatDuration } from '../utils/formatTransport';

const BADGE_CLASS = 'rounded-full bg-bg-soft px-2 text-caption font-bold text-text';

// 한 구간의 수단별(도보·대중교통·택시) 시간과 요금을 한 카드에서 비교한다 (41).
// currentMode는 구간 줄이 지금 쓰는 수단이라 「현재」로 표시한다. 계산할 수 없으면 아무것도 그리지 않는다.
export default function TransportCompare({ id, from, to, country, currentMode }) {
  const { t, i18n } = useTranslation();
  const comparison = compareTransport({ from, to, country });
  if (!comparison) return null;

  const getBadges = (mode) =>
    [
      mode === currentMode && 'current',
      comparison.fastest.includes(mode) && 'fastest',
      comparison.cheapest.includes(mode) && 'cheapest',
    ].filter(Boolean);

  return (
    <div id={id} className="mt-2 rounded-2xl border border-text/10 bg-background p-3">
      <table className="w-full text-left text-body-sm">
        <caption className="sr-only">{t('planner.transport.compare.caption')}</caption>
        <thead>
          <tr className="text-text/70">
            <th scope="col" className="pb-2 font-normal">
              {t('planner.transport.compare.mode')}
            </th>
            <th scope="col" className="pb-2 font-normal">
              {t('planner.transport.compare.duration')}
            </th>
            <th scope="col" className="pb-2 font-normal">
              {t('planner.transport.compare.cost')}
            </th>
          </tr>
        </thead>
        <tbody>
          {comparison.options.map((option) => (
            <tr key={option.mode} className="border-t border-text/10 align-top">
              <th scope="row" className="py-2 pr-2 font-bold">
                {t(`planner.transport.mode.${option.mode}`)}
                <span className="mt-1 flex flex-wrap gap-1">
                  {getBadges(option.mode).map((badge) => (
                    <span key={badge} className={BADGE_CLASS}>
                      {t(`planner.transport.compare.${badge}`)}
                    </span>
                  ))}
                </span>
              </th>
              <td className="py-2 pr-2">{formatDuration(t, option.minutes)}</td>
              <td className="py-2">
                {option.cost > 0
                  ? t('planner.transport.compare.costValue', {
                      cost: formatCost(t, i18n.language, country, option.cost),
                    })
                  : t('planner.transport.compare.free')}
                {option.nightSurcharge > 0 ? (
                  <span className="block text-caption text-text/70">
                    {t('planner.transport.compare.nightSurcharge')}
                  </span>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
