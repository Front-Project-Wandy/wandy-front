const STORAGE_PREFIX = 'wandy-expenses:';

export const EXPENSE_CATEGORIES = ['meals', 'transport', 'entry', 'shopping', 'lodging', 'other'];
// 예상 비용(57)이 계산하는 항목. 예상과 비교할 때는 지출도 이 항목만 센다.
export const ESTIMATED_CATEGORIES = ['meals', 'transport', 'entry'];
export const MAX_EXPENSE_AMOUNT = 100000000;

// 금액 입력을 정수로. 양의 정수가 아니거나 너무 크면 null이다.
export const parseAmount = (text) => {
  const amount = Number(String(text).replace(/,/g, '').trim());
  return Number.isInteger(amount) && amount > 0 && amount <= MAX_EXPENSE_AMOUNT ? amount : null;
};

const isExpense = (value) =>
  value &&
  typeof value.id === 'string' &&
  typeof value.date === 'string' &&
  EXPENSE_CATEGORIES.includes(value.category) &&
  Number.isInteger(value.amount);

// 여행별 지출 기록 (요구사항 #95). 저장소를 못 쓰거나 값이 깨져 있으면 빈 목록으로 본다.
export const readExpenses = (tripId) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}${tripId}`));
    return Array.isArray(parsed) ? parsed.filter(isExpense) : [];
  } catch {
    return [];
  }
};

export const writeExpenses = (tripId, expenses) => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${tripId}`, JSON.stringify(expenses));
  } catch {
    // 시크릿 모드 등에서 저장이 막혀도 화면 동작은 그대로 둔다
  }
};

// 총합, 카테고리별 합, 날짜별 묶음(날짜순)을 구한다.
export const summarizeExpenses = (expenses) => {
  const byCategory = Object.fromEntries(EXPENSE_CATEGORIES.map((category) => [category, 0]));
  const byDate = new Map();
  let total = 0;
  expenses.forEach((expense) => {
    total += expense.amount;
    byCategory[expense.category] += expense.amount;
    byDate.set(expense.date, [...(byDate.get(expense.date) ?? []), expense]);
  });
  const groups = [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, items]) => ({ date, items }));
  return { total, byCategory, groups };
};

// 새 지출의 기본 날짜: 오늘이 여행 기간이면 오늘, 아니면 첫날. toISOString은 UTC 기준이라 로컬 날짜로 만든다.
export const pickDefaultDate = (days, now) => {
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return days.some((day) => day.date === today) ? today : days[0].date;
};
