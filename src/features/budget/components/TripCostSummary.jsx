import { useId, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCost } from '../../transport/utils/formatTransport';
import { COUNTRY_CURRENCY } from '../constants';
import { convertCurrency, getKrwPerJpy } from '../utils/convertCurrency';
import { summarizeTripCost } from '../utils/summarizeTripCost';

const ROWS = ['transport', 'entry', 'meals'];

// 플래너 위쪽의 예상 총비용 한 줄과 펼쳐 보는 내역 (57). 일정에 장소가 없으면 보여 줄 게 없어서 그리지 않는다.
// 금액은 여행 나라 통화가 기본이고, 반대 통화로 환산한 값을 괄호로 같이 보여 준다.
// 정확한 값이 아니라서 「약」과 추정 안내를 함께 둔다.
export default function TripCostSummary({ trip }) {
  const { t, i18n } = useTranslation();
  const detailsId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const summary = useMemo(() => summarizeTripCost(trip), [trip]);
  if (!summary) return null;

  const { country } = trip;
  const otherCountry = country === 'KR' ? 'JP' : 'KR';
  const format = (amount, targetCountry = country) =>
    formatCost(t, i18n.language, targetCountry, amount);
  const toOther = (amount) =>
    convertCurrency(amount, summary.currency, COUNTRY_CURRENCY[otherCountry]);

  return (
    <section aria-label={t('planner.cost.title')} className="rounded-2xl border border-text/10 p-4">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <p className="text-body font-bold">
          {t('planner.cost.summary', {
            total: format(summary.total),
            converted: format(toOther(summary.total), otherCountry),
            perPerson: format(summary.perPerson),
          })}
        </p>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={detailsId}
          onClick={() => setIsOpen((prev) => !prev)}
          className="-my-2 rounded-sm py-2 text-body-sm text-link underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t('planner.cost.toggle')}
          <span aria-hidden="true"> {isOpen ? '▴' : '▾'}</span>
        </button>
      </div>
      {isOpen ? (
        <div id={detailsId} className="mt-3 space-y-2">
          <table className="w-full text-left text-body-sm">
            <caption className="sr-only">
              {t('planner.cost.caption', { count: summary.people })}
            </caption>
            <thead>
              <tr className="text-text/70">
                <th scope="col" className="pb-2 font-normal">
                  {t('planner.cost.item')}
                </th>
                <th scope="col" className="pb-2 text-right font-normal">
                  {t('planner.cost.amount', { count: summary.people })}
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row} className="border-t border-text/10">
                  <th scope="row" className="py-2 font-normal">
                    {t(`planner.cost.row.${row}`)}
                  </th>
                  <td className="py-2 text-right">{format(summary[row])}</td>
                </tr>
              ))}
              <tr className="border-t border-text/10 font-bold">
                <th scope="row" className="py-2">
                  {t('planner.cost.row.total')}
                </th>
                <td className="py-2 text-right">{format(summary.total)}</td>
              </tr>
            </tbody>
          </table>
          <p className="text-body-sm text-text/70">{t('planner.cost.noteEstimate')}</p>
          <p className="text-body-sm text-text/70">{t('planner.cost.noteTransport')}</p>
          <p className="text-body-sm text-text/70">
            {t('planner.cost.noteRate', { rate: getKrwPerJpy() })}
          </p>
        </div>
      ) : null}
    </section>
  );
}
