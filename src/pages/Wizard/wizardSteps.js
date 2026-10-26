// 마법사 7단계. enabled가 false인 단계(항공·숙소, 추가 기능 47·50)는 진행 표시줄에 흐리게만 보이고
// 이전/다음 이동에서 건너뛴다 — 와이어프레임 메모 "기본 기능만 구현하면 1→4→5→6→7".
// 항공·숙소를 만들면 enabled만 true로 바꾸면 된다.
export const WIZARD_STEPS = [
  { step: 1, key: 'basic', enabled: true },
  { step: 2, key: 'flight', enabled: false },
  { step: 3, key: 'stay', enabled: false },
  { step: 4, key: 'transport', enabled: true },
  { step: 5, key: 'spots', enabled: true },
  { step: 6, key: 'nearby', enabled: true },
  { step: 7, key: 'summary', enabled: true },
];

const ENABLED_STEPS = WIZARD_STEPS.filter((item) => item.enabled).map((item) => item.step);

// 지금 단계 다음/이전의 '쓸 수 있는' 단계. 없으면 null.
export const getNextStep = (step) => ENABLED_STEPS.find((item) => item > step) ?? null;
export const getPrevStep = (step) => ENABLED_STEPS.findLast((item) => item < step) ?? null;

export const getStepInfo = (step) =>
  WIZARD_STEPS.find((item) => item.step === step) ?? WIZARD_STEPS[0];
