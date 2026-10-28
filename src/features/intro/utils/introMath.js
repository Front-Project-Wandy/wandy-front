import { INTRO_FINAL_SCREEN_QUAD, INTRO_FRAME_HEIGHT, INTRO_FRAME_WIDTH } from '../constants';

export const clamp01 = (x) => Math.min(1, Math.max(0, x));

// p가 a~b 사이에서 0~1로 얼마나 왔는지
export const span = (p, a, b) => clamp01((p - a) / (b - a));

export const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

// 프레임을 w x h 화면에 덮어 그릴 때(cover)의 배율과 왼쪽 위 위치
export function getCoverRect(w, h) {
  const scale = Math.max(w / INTRO_FRAME_WIDTH, h / INTRO_FRAME_HEIGHT);
  return {
    scale,
    x: (w - INTRO_FRAME_WIDTH * scale) / 2,
    y: (h - INTRO_FRAME_HEIGHT * scale) / 2,
  };
}

const distance = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);

// 마지막 장면에서 노트북 화면 쪽으로 카메라가 들어가는 변환 (z: 0 → 1).
// 화면이 들어 올려지는 게 아니라 카메라가 화면 속으로 들어가야 해서, 무대 전체를 화면 중심 기준으로 키운다.
export function getDiveStyle(vw, vh, z) {
  const rect = getCoverRect(vw, vh);
  const [tl, tr, br, bl] = INTRO_FINAL_SCREEN_QUAD.map(([nx, ny]) => [
    rect.x + nx * INTRO_FRAME_WIDTH * rect.scale,
    rect.y + ny * INTRO_FRAME_HEIGHT * rect.scale,
  ]);
  const center = [(tl[0] + tr[0] + br[0] + bl[0]) / 4, (tl[1] + tr[1] + br[1] + bl[1]) / 4];
  const up = [(tl[0] + tr[0] - bl[0] - br[0]) / 2, (tl[1] + tr[1] - bl[1] - br[1]) / 2];
  const screenH = Math.hypot(...up);
  const screenW = (distance(tl, tr) + distance(bl, br)) / 2;
  const scale = Math.max(vw / screenW, vh / screenH) ** z;
  const rotate = -Math.atan2(up[0], -up[1]) * z;
  const shiftX = (vw / 2 - center[0]) * z;
  const shiftY = (vh / 2 - center[1]) * z;

  return {
    origin: `${center[0]}px ${center[1]}px`,
    transform:
      z > 0 ? `translate(${shiftX}px, ${shiftY}px) rotate(${rotate}rad) scale(${scale})` : 'none',
    blurPx: z > 0.25 ? (8 * span(z, 0.25, 1)) / scale : 0,
  };
}

// 프레임 기준(0~1) 네 모서리를 w x h 화면 좌표로 바꾼다 (프레임을 덮어 그린 cover 기준)
export function toViewQuad(quad, w, h) {
  const rect = getCoverRect(w, h);
  return quad.map(([nx, ny]) => [
    rect.x + nx * INTRO_FRAME_WIDTH * rect.scale,
    rect.y + ny * INTRO_FRAME_HEIGHT * rect.scale,
  ]);
}

// 왼쪽 위가 원점인 w x h 사각형을 네 모서리 [tl, tr, br, bl]에 맞추는 CSS matrix3d (원근 변환).
// 노트북 화면이 비스듬히 보여서 단순 크기·회전만으로는 모서리가 맞지 않는다.
export function getQuadMatrix(w, h, [[x0, y0], [x1, y1], [x2, y2], [x3, y3]]) {
  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const dy3 = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / den;
  const k = (dx1 * dy3 - dx3 * dy1) / den;
  const a = x1 - x0 + g * x1;
  const b = x3 - x0 + k * x3;
  const d = y1 - y0 + g * y1;
  const e = y3 - y0 + k * y3;
  return `matrix3d(${a / w},${d / w},0,${g / w},${b / h},${e / h},0,${k / h},0,0,1,0,${x0},${y0},0,1)`;
}
