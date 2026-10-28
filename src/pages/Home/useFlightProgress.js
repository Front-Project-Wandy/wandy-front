import { useEffect, useRef, useState } from 'react';

// 비행 경로가 들르는 경유지. HomePage 섹션의 data-flight-stop 값과 같은 순서·이름이어야 한다.
export const FLIGHT_STOPS = ['hero', 'cities', 'plan', 'curation', 'products', 'arrive'];

// 본문(max-w-360 = 1440px) 양옆에 여백이 생기는 폭(Tailwind 2xl)에서만 켠다. 그보다 좁으면 본문과 겹친다.
const WIDE_SCREEN = '(min-width: 96rem)';
// 섹션 윗변이 화면 위에서 이 비율에 닿으면 그 경유지에 도착한 것으로 본다.
const ANCHOR_RATIO = 0.35;
// 경유지 앞뒤로 이만큼(px) 스크롤하는 동안은 비행기가 그 자리에 머문다.
const DWELL_PX = 120;

const smoothstep = (u) => u * u * (3 - 2 * u);

// 경유지마다 쓸 두 값을 잰다. positions는 페이지 위쪽에서 잰 섹션 윗변(점이 놓일 곳),
// scrolls는 그 경유지에 도착했다고 볼 스크롤 위치다. 끝까지 스크롤해도 닿지 못하는 경유지가 없도록
// scrolls는 범위 안으로 묶고, 위치가 겹쳐도 순서가 뒤집히지 않게 1px씩 밀어 둔다.
function measureStops(elements, rail) {
  const viewport = window.innerHeight;
  // 띠는 헤더 아래(main)에서 시작하므로, 점·선·비행기 높이는 띠의 윗변을 0으로 잰다.
  const origin = rail ? rail.getBoundingClientRect().top + window.scrollY : 0;
  const maxScroll = Math.max(document.documentElement.scrollHeight - viewport, 0);
  const positions = elements.map((element) => element.getBoundingClientRect().top + window.scrollY);
  const scrolls = [];
  positions.forEach((position, index) => {
    const clamped = Math.min(Math.max(position - viewport * ANCHOR_RATIO, 0), maxScroll);
    scrolls.push(index === 0 ? clamped : Math.max(clamped, scrolls[index - 1] + 1));
  });
  return { positions, scrolls, origin };
}

// 스크롤 위치 → 경로 위 비행기 높이(페이지 위에서부터 px)와 지금 머무는 경유지 번호(없으면 -1).
function locatePlane(scroll, { positions, scrolls }) {
  const last = scrolls.length - 1;
  const dwell = scrolls.map((stop, index) => {
    const before = index > 0 ? (stop - scrolls[index - 1]) / 4 : DWELL_PX;
    const after = index < last ? (scrolls[index + 1] - stop) / 4 : DWELL_PX;
    return Math.min(DWELL_PX, before, after);
  });
  if (scroll >= scrolls[last]) return { y: positions[last], landed: last };
  for (let index = 0; index <= last; index += 1) {
    if (Math.abs(scroll - scrolls[index]) <= dwell[index]) {
      return { y: positions[index], landed: index };
    }
  }
  for (let index = 0; index < last; index += 1) {
    const from = scrolls[index] + dwell[index];
    const to = scrolls[index + 1] - dwell[index + 1];
    if (scroll > from && scroll < to) {
      const unit = smoothstep((scroll - from) / (to - from));
      return { y: positions[index] + (positions[index + 1] - positions[index]) * unit, landed: -1 };
    }
  }
  return { y: positions[0], landed: 0 };
}

// 스크롤에 맞춰 왼쪽 여백의 비행기를 옮긴다. 선·점·비행기 높이는 CSS 변수로 직접 써서 프레임마다 다시 그리지 않고,
// 머무는 경유지가 바뀔 때만 상태를 바꾼다. 섹션 높이는 이미지가 불러와지면 달라지므로 크기 변화를 지켜본다.
export function useFlightProgress() {
  const railRef = useRef(null);
  const [enabled, setEnabled] = useState(() => window.matchMedia(WIDE_SCREEN).matches);
  const [landed, setLanded] = useState(0);

  useEffect(() => {
    const query = window.matchMedia(WIDE_SCREEN);
    const handleChange = () => setEnabled(query.matches);
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    const elements = FLIGHT_STOPS.map((key) => document.querySelector(`[data-flight-stop="${key}"]`));
    if (elements.some((element) => !element)) return undefined;

    let measured = measureStops(elements, railRef.current);
    let frame = 0;
    let current = -2;

    // 경로는 첫 경유지에서 마지막 경유지까지 이어지고, 점은 각 섹션 윗변에 놓는다.
    const layout = () => {
      const rail = railRef.current;
      if (!rail) return;
      const { positions, origin } = measured;
      const first = positions[0] - origin;
      rail.style.setProperty('--line-top', `${first}px`);
      rail.style.setProperty('--line-height', `${positions[positions.length - 1] - positions[0]}px`);
      rail.querySelectorAll('li').forEach((dot, index) => {
        dot.style.setProperty('--y', `${positions[index] - origin}px`);
      });
    };
    const update = () => {
      frame = 0;
      const { y, landed: next } = locatePlane(window.scrollY, measured);
      railRef.current?.style.setProperty('--plane-y', `${(y - measured.origin).toFixed(1)}px`);
      if (next !== current) {
        current = next;
        setLanded(next);
      }
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const handleResize = () => {
      measured = measureStops(elements, railRef.current);
      layout();
      requestUpdate();
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(document.body);
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', handleResize);
    layout();
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(frame);
    };
  }, [enabled]);

  return { railRef, enabled, landed };
}
