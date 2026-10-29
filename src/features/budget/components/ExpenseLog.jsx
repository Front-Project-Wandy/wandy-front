import { useTranslation } from 'react-i18next';
import { COUNTRY_CURRENCY } from '../constants';
import { useExpenses } from '../hooks/useExpenses';
import { summarizeExpenses } from '../utils/expenses';
import { summarizeTripCost } from '../utils/summarizeTripCost';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import ExpenseSummary from './ExpenseSummary';

// 플래너의 접이식 「지출 기록」 (요구사항 #95). 여행 중 쓴 돈을 적고 예상 비용과 견준다.
// 더치페이 정산은 확장이라 넣지 않았다.
export default function ExpenseLog({ trip }) {
  const { t } = useTranslation();
  const { expenses, add, remove } = useExpenses(trip.id);
  const summary = summarizeExpenses(expenses);
  const estimated = summarizeTripCost(trip);

  return (
    <details className="rounded-2xl border border-text/10 p-4">
      <summary className="cursor-pointer text-body font-bold">{t('planner.expense.title')}</summary>
      <div className="mt-4 space-y-4">
        <ExpenseForm
          days={trip.days}
          currencyLabel={COUNTRY_CURRENCY[trip.country] ?? ''}
          onAdd={add}
        />
        {expenses.length === 0 ? (
          <p className="text-body-sm text-text/70">{t('planner.expense.empty')}</p>
        ) : (
          <>
            <ExpenseSummary
              summary={summary}
              estimatedTotal={estimated?.total ?? null}
              country={trip.country}
            />
            <ExpenseList
              groups={summary.groups}
              days={trip.days}
              country={trip.country}
              onRemove={remove}
            />
          </>
        )}
        <p className="text-caption text-text/70">{t('planner.expense.note')}</p>
      </div>
    </details>
  );
}
