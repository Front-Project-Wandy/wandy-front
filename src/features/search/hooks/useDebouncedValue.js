import { useEffect, useState } from 'react';

// 입력이 멈추고 delay(ms)가 지나야 값을 바꾼다 — 글자 하나마다 검색 요청이 가지 않게.
export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
