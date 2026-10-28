import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getIntroPageSrc,
  INTRO_CABIN_OFFSET,
  INTRO_FRAME_COUNT,
  INTRO_FRAME_HEIGHT,
  INTRO_FRAME_WIDTH,
  INTRO_PAGE_FADE_FRAMES,
  INTRO_PAGE_HEIGHT,
  INTRO_PAGE_WIDTH,
  INTRO_PLAY_END,
  INTRO_SCRUB_SECONDS,
  INTRO_WHITE_FROM,
} from '../constants';
import { findReadyFrame, useIntroFrames } from '../hooks/useIntroFrames';
import { getScreenQuad, useScreenTrack } from '../hooks/useScreenTrack';
import {
  clamp01,
  easeInOutCubic,
  getCoverRect,
  getDiveStyle,
  getQuadMatrix,
  span,
  toViewQuad,
} from '../utils/introMath';

const LEAVE_MS = 500;

// 화면 전체를 덮고 스크롤 진행도(0~1)에 맞춰 프레임을 그린다. 끝나면 onFinish, 사라지면 onLeft.
// 노트북 화면이 깨끗하게 보이기 시작하면 메인화면 사진을 그 화면 모서리에 맞춰 얹고,
// 카메라가 화면 속으로 들어가 사진이 화면을 가득 채우면 덮개가 걷히며 진짜 홈 화면이 이어진다.
export default function IntroOverlay({ getProgress, leaving, onFinish, onLeft }) {
  const { t } = useTranslation();
  const { imagesRef, loadedCount } = useIntroFrames();
  const trackRef = useScreenTrack();
  // 사진은 지금 테마에 맞춰 고른다 (index.html이 첫 화면 전에 <html data-theme>을 정해 둔다).
  const [pageSrc] = useState(() => getIntroPageSrc(document.documentElement.dataset.theme));
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const pageRef = useRef(null);
  const whiteRef = useRef(null);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    // 덮개가 사라질 때 React는 ref를 먼저 비우고 이 정리 함수는 조금 뒤에 부른다.
    // 그 사이에 tick이 한 번 더 돌아도 null을 읽지 않게, 요소를 여기서 잡아 두고 쓴다.
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const white = whiteRef.current;
    const page = pageRef.current;
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

      const frame = Math.round(span(smooth, 0, INTRO_PLAY_END) * (INTRO_FRAME_COUNT - 1));
      draw(frame);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const z = easeInOutCubic(span(smooth, INTRO_PLAY_END, 1));
      const dive = getDiveStyle(vw, vh, z);
      // 매 프레임 바뀌는 값이라 JSX style 대신 DOM에 직접 넣는다.
      stage.style.transformOrigin = dive.origin;
      stage.style.transform = dive.transform;
      canvas.style.filter = dive.blurPx ? `blur(${dive.blurPx}px)` : 'none';

      // 메인화면 사진은 무대(stage) 안에 있어서 들어가는 변환을 영상과 같이 받는다. 흐림은 영상에만 준다.
      const track = trackRef.current;
      const pageReady = Boolean(track) && page.complete && page.naturalWidth > 0;
      const cabinIndex = frame - INTRO_CABIN_OFFSET;
      const quad = pageReady ? getScreenQuad(track, cabinIndex) : null;
      if (quad) {
        page.style.transform = getQuadMatrix(
          INTRO_PAGE_WIDTH,
          INTRO_PAGE_HEIGHT,
          toViewQuad(quad, vw, vh),
        );
        page.style.opacity = String(
          easeInOutCubic(clamp01((cabinIndex - track.first) / INTRO_PAGE_FADE_FRAMES)),
        );
      } else {
        page.style.opacity = '0';
      }
      white.style.opacity = pageReady ? '0' : String(span(z, INTRO_WHITE_FROM, 1));

      if (!finished && target >= 1 && smooth > 0.998) {
        finished = true;
        onFinishRef.current();
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [getProgress, imagesRef, trackRef]);

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
        <img
          ref={pageRef}
          src={pageSrc}
          alt=""
          aria-hidden="true"
          width={INTRO_PAGE_WIDTH}
          height={INTRO_PAGE_HEIGHT}
          decoding="async"
          className="pointer-events-none absolute top-0 left-0 max-w-none origin-top-left opacity-0"
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
