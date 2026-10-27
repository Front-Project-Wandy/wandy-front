import { useEffect, useRef, useState } from 'react';
import { getIntroFrameSrc, INTRO_FRAME_COUNT, INTRO_HD_MIN_PIXELS } from '../constants';

// 인트로 프레임 417장을 미리 받아 둔다. 화면이 크면 1080p, 아니면 720p.
export function useIntroFrames() {
  const imagesRef = useRef([]);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    const pixels = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2);
    const set = pixels > INTRO_HD_MIN_PIXELS ? '1080' : '720';
    let alive = true;

    imagesRef.current = Array.from({ length: INTRO_FRAME_COUNT }, (_, i) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        if (alive) setLoadedCount((n) => n + 1);
      };
      img.src = getIntroFrameSrc(set, i);
      return img;
    });

    return () => {
      alive = false;
      imagesRef.current.forEach((img) => {
        img.onload = null;
      });
    };
  }, []);

  return { imagesRef, loadedCount };
}

// 아직 안 받은 프레임이면 그 앞에서 가장 가까운 받은 프레임을 쓴다.
export function findReadyFrame(images, index) {
  for (let i = index; i >= 0; i -= 1) {
    const img = images[i];
    if (img?.complete && img.naturalWidth) return img;
  }
  return null;
}
