import { useId, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { evaluatePasses, PASS_PRICES_CHECKED_AT } from '../utils/evaluatePasses';
import { formatCost } from '../utils/formatTransport';

// 플래너의 교통패스 이득 안내 (요구사항 #76). 일정의 대중교통 추정 요금과 패스 가격을 견줘서
// 가장 이득인 패스와 쓸 DAY를 한 줄로 알려 주고, 펼치면 패스별 비교를 보여 준다.
// 대중교통 구간이 없으면 견줄 게 없어서 그리지 않는다. 요금이 추정이라 「약」과 안내 문구를 함께 둔다.
export default function TransitPassAdvice({ trip }) {
  const { t, i18n } = useTranslation();
  const detailsId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const result = useMemo(() => evaluatePasses(trip), [trip]);
  if (!result) return null;

  const { country, people } = trip;
  const money = (amount) => formatCost(t, i18n.language, country, amount);
  const formatRange = ({ startDay, endDay }) =>
    startDay === endDay
      ? t('planner.pass.rangeOne', { day: startDay + 1 })
      : t('planner.pass.rangeMany', { start: startDay + 1, end: endDay + 1 });
  const { best } = result;

  return (
    <section aria-label={t('planner.pass.title')} className="rounded-2xl border border-text/10 p-4">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <p className="text-body font-bold">
          {best
            ? t('planner.pass.best', {
                name: best.pass.name,
                price: money(best.pass.price),
                range: formatRange(best),
                benefit: money(best.benefit),
              })
            : t('planner.pass.none')}
          {best && people > 1
            ? ` ${t('planner.pass.group', { people, total: money(best.benefit * people) })}`
            : ''}
        </p>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={detailsId}
          onClick={() => setIsOpen((prev) => !prev)}
          className="-my-2 rounded-sm py-2 text-body-sm text-link underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t('planner.pass.toggle')}
          <span aria-hidden="true"> {isOpen ? '▴' : '▾'}</span>
        </button>
      </div>
      {isOpen ? (
        <div id={detailsId} className="mt-3 space-y-2">
          <table className="w-full text-left text-body-sm">
            <caption className="sr-only">{t('planner.pass.caption')}</caption>
            <thead>
              <tr className="text-text/70">
                {['name', 'range', 'price', 'covered', 'result'].map((column) => (
                  <th key={column} scope="col" className="pb-2 font-normal">
                    {t(`planner.pass.column.${column}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.options.map((option) => (
                <tr key={option.pass.id} className="border-t border-text/10">
                  <th scope="row" className="py-2 font-normal">
                    {option.pass.name}
                  </th>
                  <td className="py-2">{formatRange(option)}</td>
                  <td className="py-2">{money(option.pass.price)}</td>
                  <td className="py-2">{money(option.coveredCost)}</td>
                  <td className="py-2 font-bold">
                    {option.benefit > 0
                      ? t('planner.pass.benefit', { amount: money(option.benefit) })
                      : t('planner.pass.loss', { amount: money(-option.benefit) })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-body-sm text-text/70">{t(`planner.pass.noteEstimate.${country}`)}</p>
          <p className="text-body-sm text-text/70">
            {t('planner.pass.noteDay', { date: PASS_PRICES_CHECKED_AT })}
          </p>
        </div>
      ) : null}
    </section>
  );
}
