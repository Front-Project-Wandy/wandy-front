import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  INTRO_FRAME_COUNT,
  INTRO_FRAME_HEIGHT,
  INTRO_FRAME_WIDTH,
  INTRO_PLAY_END,
  INTRO_SCRUB_SECONDS,
  INTRO_WHITE_FROM,
} from '../constants';
import { findReadyFrame, useIntroFrames } from '../hooks/useIntroFrames';
import { easeInOutCubic, getCoverRect, getDiveStyle, span } from '../utils/introMath';

const LEAVE_MS = 500;

// 화면 전체를 덮고 스크롤 진행도(0~1)에 맞춰 프레임을 그린다. 끝나면 onFinish, 사라지면 onLeft.
export default function IntroOverlay({ getProgress, leaving, onFinish, onLeft }) {
  const { t } = useTranslation();
  const { imagesRef, loadedCount } = useIntroFrames();
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const whiteRef = useRef(null);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let smooth = getProgress();
    let last = performance.now();
    let drawn = null;
    let finished = false;
    let frameId = 0;

    const draw = (index) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        drawn = null;
      }
      const img = findReadyFrame(imagesRef.current, index);
      if (!img || img === drawn) return;
      const rect = getCoverRect(w, h);
      ctx.drawImage(
        img,
        rect.x,
        rect.y,
        INTRO_FRAME_WIDTH * rect.scale,
        INTRO_FRAME_HEIGHT * rect.scale,
      );
      drawn = img;
    };

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const target = getProgress();
      smooth += (target - smooth) * (1 - Math.exp(-dt / INTRO_SCRUB_SECONDS));
      if (Math.abs(target - smooth) < 0.0005) smooth = target;

      draw(Math.round(span(smooth, 0, INTRO_PLAY_END) * (INTRO_FRAME_COUNT - 1)));
      const z = easeInOutCubic(span(smooth, INTRO_PLAY_END, 1));
      const dive = getDiveStyle(window.innerWidth, window.innerHeight, z);
      // 매 프레임 바뀌는 값이라 JSX style 대신 DOM에 직접 넣는다.
      stageRef.current.style.transformOrigin = dive.origin;
      stageRef.current.style.transform = dive.transform;
      canvas.style.filter = dive.blurPx ? `blur(${dive.blurPx}px)` : 'none';
      whiteRef.current.style.opacity = String(span(z, INTRO_WHITE_FROM, 1));

      if (!finished && target >= 1 && smooth > 0.998) {
        finished = true;
        onFinishRef.current();
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [getProgress, imagesRef]);

  // 흰 화면이 걷히는 시간이 지나면 덮개를 없앤다.
  useEffect(() => {
    if (!leaving) return undefined;
    const timer = setTimeout(onLeft, LEAVE_MS);
    return () => clearTimeout(timer);
  }, [leaving, onLeft]);

  // 영상이 뜨기 전 배경. 테마와 상관없이 어둡게 (ink) — text는 다크모드에서 밝아진다 (#89).
  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-ink transition-opacity duration-500 ${leaving ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
    >
      <div ref={stageRef} className="absolute inset-0">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={t('intro.video.label')}
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <div
        ref={whiteRef}
        className="pointer-events-none absolute inset-0 bg-background opacity-0"
      />
      {loadedCount < INTRO_FRAME_COUNT && (
        <p className="absolute inset-x-0 bottom-6 text-center text-caption text-bg-soft">
          {t('intro.state.loading', { loaded: loadedCount, total: INTRO_FRAME_COUNT })}
        </p>
      )}
      {!leaving && (
        <button
          type="button"
          onClick={onFinish}
          className="absolute right-4 top-4 h-10 rounded-full bg-primary px-4 text-body font-bold text-white lg:right-6"
        >
          {t('intro.action.skip')}
        </button>
      )}
    </div>
  );
}
