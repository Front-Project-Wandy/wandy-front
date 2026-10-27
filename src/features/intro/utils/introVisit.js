import { INTRO_FORCE_PARAM, INTRO_SEEN_KEY } from '../constants';

// 처음 온 사람에게만 인트로를 보여준다. 움직임 줄이기 설정을 켠 사람은 건너뛴다.
export function shouldPlayIntro() {
  if (typeof window === 'undefined') return false;
  if (new URLSearchParams(window.location.search).has(INTRO_FORCE_PARAM)) return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    return window.localStorage.getItem(INTRO_SEEN_KEY) !== '1';
  } catch {
    return true;
  }
}

export function markIntroSeen() {
  try {
    window.localStorage.setItem(INTRO_SEEN_KEY, '1');
  } catch {
    // 저장이 막힌 브라우저(사생활 보호 모드 등)는 다음에 인트로가 다시 나와도 괜찮다.
  }
}
