// STEP1 여행 스타일 선택지 (46). 화면 글자는 wizard.style.* 번역 키로 꺼낸다.
// 스타일 값은 프로필(B)과 플랜 store(C)가 같이 쓰는 값이라 member/constants의 TRAVEL_STYLES를 그대로 쓴다.
export { TRAVEL_STYLES } from '../../features/member/constants';

export const COMPANIONS = ['solo', 'couple', 'friends', 'family', 'kids'];

// 1인 기준 여행 경비(항공·숙소 포함) 범위. 원 단위 경계를 같이 둬서 나중에 예상 총비용(57)과 비교할 수 있게 한다.
// max가 null이면 상한 없음.
export const BUDGET_RANGES = [
  { key: 'under50', min: 0, max: 500000 },
  { key: '50to100', min: 500000, max: 1000000 },
  { key: '100to200', min: 1000000, max: 2000000 },
  { key: 'over200', min: 2000000, max: null },
];
