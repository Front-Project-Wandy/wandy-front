import { useEffect, useRef } from 'react';
import { INTRO_SCREEN_TRACK_SRC } from '../constants';

// 노트북 화면 위치 데이터를 받아 둔다. 못 받으면 null로 두고, 인트로는 예전처럼 흰 화면으로 끝난다.
export function useScreenTrack() {
  const trackRef = useRef(null);

  useEffect(() => {
    let alive = true;
    fetch(INTRO_SCREEN_TRACK_SRC)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (alive && Number.isInteger(data?.first) && data.quads?.length) trackRef.current = data;
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
