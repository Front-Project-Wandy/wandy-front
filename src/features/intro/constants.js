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

// 메인화면 사진이나 화면 위치 데이터를 못 받았을 때만, 들어가는 동안 마지막 35%에서 화면을 흰색으로 덮는다
export const INTRO_WHITE_FROM = 0.65;

// 노트북 화면에 얹는 메인화면 사진. 1440x900(16:10, 노트북 화면 비율) 화면을 2배로 찍은 것이다.
// 홈 디자인이 바뀌면 다시 찍는다 (dev 서버를 켜고, 인트로가 안 나오게 움직임 줄이기를 켠 채로):
//   "Google Chrome" --headless=new --hide-scrollbars --force-prefers-reduced-motion
//     --blink-settings=preferredColorScheme=1(라이트) 또는 --force-dark-mode(다크)
//     --window-size=1440,900 --force-device-scale-factor=2 --screenshot=page.png http://localhost:5173/
//   → JPEG(품질 80)로 public/intro/page-light.jpg, page-dark.jpg
export const INTRO_PAGE_WIDTH = 1440;
export const INTRO_PAGE_HEIGHT = 900;

// 프레임마다 잡아 둔 노트북 화면 네 모서리 (프레임 기준 0~1 좌표, 기내 영상 cabin_track.json에서 뽑음).
// first = 머리카락에 가리지 않고 화면이 깨끗하게 잡히기 시작하는 기내 프레임 번호, quads[0]이 그 프레임이다.
export const INTRO_SCREEN_TRACK_SRC = '/intro/screen-track.json';

// 기내 영상 i번 프레임 = 전체 240 + i번 프레임
export const INTRO_CABIN_OFFSET = 240;

// 노트북 화면에 메인화면이 켜지는 데 걸리는 프레임 수
export const INTRO_PAGE_FADE_FRAMES = 8;

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

export const getIntroPageSrc = (theme) => `/intro/page-${theme === 'dark' ? 'dark' : 'light'}.jpg`;

export function getIntroFrameSrc(set, index) {
  return `/intro/${set}/frame_${String(index + 1).padStart(4, '0')}.jpg`;
}
