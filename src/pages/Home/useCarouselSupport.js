import { useState } from 'react';

// 움직이는 3D 캐러셀(WebGL)을 써도 되는지. 움직임 줄이기를 켰거나 WebGL이 없으면 정지 사진으로 대신한다.
const canUseCarousel = () => {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    const gl =
      document.createElement('canvas').getContext('webgl2') ??
      document.createElement('canvas').getContext('webgl');
    // 확인만 하고 바로 돌려줘서, 실제 캐러셀이 쓸 WebGL 자리를 차지하지 않게 한다
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
};

export function useCarouselSupport() {
  const [supported] = useState(canUseCarousel);
  return supported;
}
