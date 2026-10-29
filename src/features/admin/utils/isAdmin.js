// 관리자 화면(85)에 들어갈 수 있는 사용자인지.
// 1단계는 서버도 권한도 없어서 로그인한 사용자를 모두 관리자로 본다. 게스트는 로그인이 아니라서 뺀다.
// 2단계에서는 서버가 준 권한(user.role === 'admin' 같은 값)으로 이 함수 안만 바꾼다.
export function isAdmin(user) {
  return Boolean(user) && user.provider !== 'guest';
}
