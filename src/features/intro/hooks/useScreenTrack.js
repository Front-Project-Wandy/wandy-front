import { useEffect, useRef } from 'react';
import { getIntroMaskSrc, INTRO_SCREEN_TRACK_SRC } from '../constants';

// 노트북 화면 위치 데이터와 가림 마스크를 받아 둔다. 못 받으면 null로 두고, 인트로는 예전처럼 흰 화면으로 끝난다.
export function useScreenTrack() {
  const trackRef = useRef(null);

  useEffect(() => {
    let alive = true;
    fetch(INTRO_SCREEN_TRACK_SRC)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!alive || !Number.isInteger(data?.first) || !data.quads?.length) return;
        const masks = data.masks ?? [];
        trackRef.current = {
          ...data,
          maskSet: new Set(masks),
          // 마스크를 미리 받아 둬야 그 프레임에 왔을 때 깜빡이지 않는다
          maskImages: masks.map((cabinIndex) => {
            const img = new Image();
            img.src = getIntroMaskSrc(cabinIndex);
            return img;
          }),
        };
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return trackRef;
}

// 전체 프레임 번호의 노트북 화면 네 모서리. 화면이 아직 깨끗하게 안 잡히는 프레임이면 null.
// 영상이 끝난 뒤(들어가는 동안)는 마지막 모서리를 그대로 쓴다.
export function getScreenQuad(track, cabinIndex) {
  if (!track || cabinIndex < track.first) return null;
  return track.quads[Math.min(cabinIndex - track.first, track.quads.length - 1)];
}

// 그 프레임에 쓸 가림 마스크 (CSS mask-image 값). 화면이 다 보이는 프레임은 'none'.
export function getScreenMask(track, cabinIndex) {
  return track?.maskSet.has(cabinIndex) ? `url(${getIntroMaskSrc(cabinIndex)})` : 'none';
}
