// 스크롤 인트로 설정값. 프레임은 public/intro/{720,1080}/frame_0001.jpg ~ frame_0417.jpg
// (외관 0~144 → 창문 통과 145~240 → 기내 241~416, 24fps 17.4초)

export const INTRO_FRAME_COUNT = 417;

// 프레임은 16:9 — 화면을 덮도록(cover) 그릴 때 비율만 쓴다.
export const INTRO_FRAME_WIDTH = 1920;
export const INTRO_FRAME_HEIGHT = 1080;

// 화면 폭 x DPR이 이 값보다 크면 1080p, 아니면 720p 프레임을 받는다.
export const INTRO_HD_MIN_PIXELS = 1500;

// 인트로가 차지하는 스크롤 길이는 IntroGate의 h-[1600vh] (화면 15장 + 마지막 화면 1장)

// 스크롤 0~90%는 영상 재생, 90~100%는 마지막 장면에서 노트북 화면 속으로 들어가기
export const INTRO_PLAY_END = 0.9;

// 들어가는 동안 마지막 35%에서 화면을 흰색으로 덮는다 (노트북 화면은 흰색으로 둔다는 결정)
export const INTRO_WHITE_FROM = 0.65;

// 스크롤을 따라가는 부드러움 (초). 클수록 늦게 따라온다.
export const INTRO_SCRUB_SECONDS = 0.12;

// 마지막 프레임의 노트북 화면 네 모서리 (프레임 기준 0~1 좌표, cabin_track.json 176번)
export const INTRO_FINAL_SCREEN_QUAD = [
  [0.07207, 0.02486],
  [0.92793, 0.02486],
  [0.92793, 0.97514],
  [0.07207, 0.97514],
];

// 한 번 본 사람은 다시 보지 않는다. 주소에 ?intro 를 붙이면 다시 볼 수 있다.
export const INTRO_SEEN_KEY = 'wandy.introSeen';
export const INTRO_FORCE_PARAM = 'intro';

export function getIntroFrameSrc(set, index) {
  return `/intro/${set}/frame_${String(index + 1).padStart(4, '0')}.jpg`;
}
