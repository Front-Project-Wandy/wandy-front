import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import { formatCost } from '../../transport/utils/formatTransport';

// 날짜별로 묶은 지출 목록 (요구사항 #95). 지우면 바로 사라지고 되돌릴 수 없어서 버튼 이름에 어떤 지출인지 적는다.
export default function ExpenseList({ groups, days, country, onRemove }) {
  const { t, i18n } = useTranslation();

  return (
    <ul className="space-y-3">
      {groups.map((group) => {
        const dayIndex = days.findIndex((day) => day.date === group.date);
        return (
          <li key={group.date}>
            <p className="mb-1 text-body-sm font-bold">
              {dayIndex >= 0
                ? t('planner.expense.dayOption', { number: dayIndex + 1, date: group.date })
                : group.date}
            </p>
            <ul className="space-y-1">
              {group.items.map((expense) => {
                const label = t(`planner.expense.category.${expense.category}`);
                const amount = formatCost(t, i18n.language, country, expense.amount);
                return (
                  <li key={expense.id} className="flex items-center justify-between gap-2">
                    <p className="min-w-0 text-body-sm">
                      <span className="font-bold">{label}</span>
                      {expense.memo ? ` · ${expense.memo}` : ''}
                      <span className="ml-2">{amount}</span>
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0"
                      aria-label={t('planner.expense.removeLabel', { label, amount })}
                      onClick={() => onRemove(expense.id)}
                    >
                      {t('planner.expense.remove')}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}
