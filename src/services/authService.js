// 로그인 (M01). 1단계: 서버가 없어서 src/mocks/socialUsers.json의 가짜 사용자를 돌려준다.
// 2단계: 소셜 로그인은 백엔드가 OAuth를 처리하므로 loginWithProvider 안을
//   window.location.assign(`${API_BASE}/oauth2/authorization/${provider}`) 로 바꾸고,
//   결과는 백엔드가 돌려보내는 /login/callback 화면에서 받는다. client secret은 프론트에 두지 않는다.
import socialUsers from '../mocks/socialUsers.json';
import takenIds from '../mocks/takenIds.json';
import { mockRequest } from './api/mockRequest';

// provider: 'kakao' | 'naver' | 'google' → { id, name, provider }
export function loginWithProvider(provider) {
  return mockRequest(() => {
    const user = socialUsers[provider];
    if (!user) throw new Error('UNKNOWN_PROVIDER');
    return { ...user, provider };
  });
}

// 아이디·비밀번호 로그인. 1단계는 입력한 아이디를 그대로 이름으로 쓴다 (비밀번호는 확인하지 않는다).
export function loginWithPassword({ id }) {
  return mockRequest(() => ({ id: `local:${id}`, name: id, provider: 'local' }));
}

// 회원가입 (M02). 가입하면 바로 로그인된 사용자를 돌려준다.
// 1단계는 저장하지 않고, src/mocks/takenIds.json의 아이디만 "이미 쓰는 아이디"(ID_TAKEN)로 실패시킨다.
export function signup({ id, nickname }) {
  return mockRequest(() => {
    if (takenIds.includes(id)) throw new Error('ID_TAKEN');
    return { id: `local:${id}`, name: nickname, provider: 'local' };
  });
}
