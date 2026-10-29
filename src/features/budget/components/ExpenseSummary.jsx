import { useTranslation } from 'react-i18next';
import { formatCost } from '../../transport/utils/formatTransport';
import { ESTIMATED_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/expenses';

// 지출 합계와 분류별 합, 예상 비용과의 비교 (요구사항 #95).
// 예상 비용(57)은 교통·입장료·식비만 계산해서, 비교할 때는 지출도 그 세 가지만 센다.
export default function ExpenseSummary({ summary, estimatedTotal, country }) {
  const { t, i18n } = useTranslation();
  const format = (amount) => formatCost(t, i18n.language, country, amount);
  const comparable = ESTIMATED_CATEGORIES.reduce((sum, key) => sum + summary.byCategory[key], 0);
  const gap = estimatedTotal === null ? null : estimatedTotal - comparable;

  return (
    <div className="space-y-2">
      <p className="text-body font-bold" aria-live="polite">
        {t('planner.expense.total', { amount: format(summary.total) })}
      </p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-body-sm text-text/70">
        {EXPENSE_CATEGORIES.filter((key) => summary.byCategory[key] > 0).map((key) => (
          <li key={key}>
            {t(`planner.expense.category.${key}`)} {format(summary.byCategory[key])}
          </li>
        ))}
      </ul>
      {gap !== null ? (
        <p className="text-body-sm">
          {t('planner.expense.compare', {
            estimated: format(estimatedTotal),
            spent: format(comparable),
          })}{' '}
          <span className="font-bold">
            {gap >= 0
              ? t('planner.expense.remaining', { amount: format(gap) })
              : t('planner.expense.over', { amount: format(-gap) })}
          </span>
        </p>
      ) : null}
    </div>
  );
}
