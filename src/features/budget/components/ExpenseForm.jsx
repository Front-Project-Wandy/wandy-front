import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import Chip from '../../../components/common/Chip';
import Input from '../../../components/common/Input';
import { EXPENSE_CATEGORIES, parseAmount, pickDefaultDate } from '../utils/expenses';

// 지출 한 건 입력 (요구사항 #95): 날짜(DAY), 분류, 금액, 메모. 금액은 여행 나라 통화 기준이다.
export default function ExpenseForm({ days, currencyLabel, onAdd }) {
  const { t } = useTranslation();
  const [date, setDate] = useState(() => pickDefaultDate(days, new Date()));
  const [category, setCategory] = useState('meals');
  const [amountText, setAmountText] = useState('');
  const [memo, setMemo] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const amount = parseAmount(amountText);
    if (amount === null) {
      setError(t('planner.expense.amountError'));
      return;
    }
    onAdd({ date, category, amount, memo });
    setAmountText('');
    setMemo('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="expense-date" className="text-body-sm font-bold">
          {t('planner.expense.date')}
        </label>
        <select
          id="expense-date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="h-11 rounded-xl border border-text/20 bg-background px-3 text-body outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {days.map((day, index) => (
            <option key={day.date} value={day.date}>
              {t('planner.expense.dayOption', { number: index + 1, date: day.date })}
            </option>
          ))}
        </select>
      </div>
      <div
        role="group"
        aria-label={t('planner.expense.category.label')}
        className="flex flex-wrap gap-2"
      >
        {EXPENSE_CATEGORIES.map((key) => (
          <Chip
            key={key}
            label={t(`planner.expense.category.${key}`)}
            selected={category === key}
            onClick={() => setCategory(key)}
          />
        ))}
      </div>
      <Input
        label={t('planner.expense.amount', { currency: currencyLabel })}
        type="text"
        inputMode="numeric"
        value={amountText}
        onChange={(event) => setAmountText(event.target.value)}
        error={error}
      />
      <Input
        label={t('planner.expense.memo')}
        value={memo}
        maxLength={40}
        onChange={(event) => setMemo(event.target.value)}
      />
      <Button type="submit" size="sm">
        {t('planner.expense.add')}
      </Button>
    </form>
  );
}
