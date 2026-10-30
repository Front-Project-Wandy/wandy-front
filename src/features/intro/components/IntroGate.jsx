import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { IntroPlayingContext } from '../hooks/useIntroPlaying';
import { markIntroSeen, shouldPlayIntro } from '../utils/introVisit';
import IntroOverlay from './IntroOverlay';

// 처음 온 사람에게 스크롤 인트로를 먼저 보여주고, 끝나면 children(홈 화면) 맨 위로 넘겨준다.
// 인트로 동안은 위쪽에 긴 빈 공간을 두어 스크롤로 진행도를 만든다.
// 인트로가 도는지는 IntroPlayingContext로 알려서, 홈 배너가 그동안 자동으로 넘어가지 않게 한다.
export default function IntroGate({ children }) {
  const [phase, setPhase] = useState(() => (shouldPlayIntro() ? 'playing' : 'off'));
  const spacerRef = useRef(null);

  const getProgress = useCallback(() => {
    const spacer = spacerRef.current;
    if (!spacer) return 1;
    const distance = spacer.offsetHeight - window.innerHeight;
    return distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 1;
  }, []);

  const handleFinish = useCallback(() => {
    markIntroSeen();
    setPhase('leaving');
  }, []);

  const handleLeft = useCallback(() => setPhase('off'), []);

  // 빈 공간을 없애는 순간 맨 위로 올려서, 흰 화면이 걷히면 홈 화면 첫 부분이 그대로 보이게 한다.
  useLayoutEffect(() => {
    if (phase === 'leaving') window.scrollTo(0, 0);
  }, [phase]);

  // 덮개가 걷히는 동안은 휠·터치 스크롤을 막는다. 인트로를 넘기던 스크롤(트랙패드 관성 포함)이 이어지면
  // 홈이 내려간 채로 드러나서 노트북 화면 속 첫 화면과 어긋난다.
  useEffect(() => {
    if (phase !== 'leaving') return undefined;
    const block = (event) => event.preventDefault();
    const options = { passive: false };
    window.addEventListener('wheel', block, options);
    window.addEventListener('touchmove', block, options);
    return () => {
      window.removeEventListener('wheel', block, options);
      window.removeEventListener('touchmove', block, options);
    };
  }, [phase]);

  return (
    <>
      {phase === 'playing' && <div ref={spacerRef} aria-hidden="true" className="h-[1600vh]" />}
      <IntroPlayingContext value={phase === 'playing'}>
        <div inert={phase === 'playing'}>{children}</div>
      </IntroPlayingContext>
      {phase !== 'off' && (
        <IntroOverlay
          getProgress={getProgress}
          leaving={phase === 'leaving'}
          onFinish={handleFinish}
          onLeft={handleLeft}
        />
      )}
    </>
  );
}
