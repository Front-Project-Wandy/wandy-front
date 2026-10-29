import { useEffect, useState } from 'react';

const TICK_MS = 30 * 1000;

// 지금 시각. 남은 시간이 화면에서 멈춰 있지 않게 30초마다 다시 읽는다 (요구사항 #93).
export function useNow() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), TICK_MS);
    return () => clearInterval(timer);
  }, []);

  return now;
}
