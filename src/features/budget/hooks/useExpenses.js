import { useState } from 'react';
import { readExpenses, writeExpenses } from '../utils/expenses';

// 지출 기록 (요구사항 #95). 1단계라 서버가 없어서 여행별로 localStorage에 둔다. 2단계에서 서버 저장으로 옮긴다.
// 여행이 바뀌면 컴포넌트를 새로 만들어(key=tripId) 그 여행의 값을 다시 읽게 한다.
export function useExpenses(tripId) {
  const [expenses, setExpenses] = useState(() => readExpenses(tripId));

  const update = (next) => {
    setExpenses(next);
    writeExpenses(tripId, next);
  };

  const add = ({ date, category, amount, memo }) =>
    update([...expenses, { id: crypto.randomUUID(), date, category, amount, memo: memo.trim() }]);
  const remove = (expenseId) => update(expenses.filter((expense) => expense.id !== expenseId));

  return { expenses, add, remove };
}
