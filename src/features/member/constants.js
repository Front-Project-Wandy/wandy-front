export const TRAVEL_STYLES = ['relaxed', 'normal', 'packed'];
export const PREFERENCES_STORAGE_KEY = 'wandy.preferences';
export const AUTH_STORAGE_KEY = 'wandy.auth';
// 로그인 화면의 소셜 로그인 버튼 순서
export const SOCIAL_PROVIDERS = ['kakao', 'naver', 'google'];
// 로그인 없이 둘러보는 사용자. 이름은 화면에서 번역 문구로 보여 준다.
// 1단계는 막는 기능이 없고, 2단계에서 "회원은 서버 저장, 게스트는 이 기기에만 저장"으로 나눈다.
export const GUEST_USER = { id: 'guest', name: null, provider: 'guest' };
