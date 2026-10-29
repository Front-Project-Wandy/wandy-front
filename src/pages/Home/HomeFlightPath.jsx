import { FLIGHT_STOPS, useFlightProgress } from './useFlightProgress';

// 홈 왼쪽 여백의 비행 경로 — 페이지 처음부터 끝까지 이어진 선 위로 비행기가 내려가고, 섹션마다 둔 경유지에서 잠깐 머문다.
// 장식이라 스크린리더와 클릭에서는 빼고, 본문과 겹치지 않는 넓은 화면에서만 그린다.
export default function HomeFlightPath() {
  const { railRef, enabled, landed } = useFlightProgress();
  if (!enabled) return null;

  return (
    <div ref={railRef} aria-hidden="true" className="flight-rail">
      <div className="flight-line absolute left-1/2 border-l border-dashed border-text/25" />
      <div className="flight-trail absolute left-1/2 border-l-2 border-primary/60" />
      <ol>
        {FLIGHT_STOPS.map((key, index) => (
          <li key={key} data-landed={landed === index} className="flight-stop group">
            <span className="block size-3 rounded-full border-2 border-primary bg-background group-data-[landed=true]:scale-125 group-data-[landed=true]:bg-primary" />
          </li>
        ))}
      </ol>
      <div className="flight-plane" data-landed={landed !== -1}>
        <svg
          viewBox="0 0 24 24"
          className="size-6 rotate-180 text-primary data-[landed=true]:rotate-90 motion-safe:transition-transform motion-safe:duration-300"
          data-landed={landed !== -1}
          fill="currentColor"
        >
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
      </div>
    </div>
  );
}
