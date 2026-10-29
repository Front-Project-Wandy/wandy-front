// 회원가입 입력 검사 (M02). 칸마다 번역 키를 돌려주고, 통과한 칸은 빈 문자열이다.
// 2단계에서 서버도 같은 규칙으로 다시 검사하지만, 화면에서 먼저 막아 바로 고칠 수 있게 한다.
const ID_PATTERN = /^[a-z0-9]{4,20}$/;
const PASSWORD_MIN_LENGTH = 8;
const NICKNAME_MIN_LENGTH = 2;
const NICKNAME_MAX_LENGTH = 10;

export const validateSignup = ({ id, password, passwordConfirm, nickname, agreed }) => {
  const trimmedNickname = nickname.trim();
  const errors = {
    id: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
    agreed: '',
  };

  if (id === '') errors.id = 'signup.error.idRequired';
  else if (!ID_PATTERN.test(id)) errors.id = 'signup.error.idPattern';

  if (password === '') errors.password = 'signup.error.passwordRequired';
  else if (
    password.length < PASSWORD_MIN_LENGTH ||
    !/[a-zA-Z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    errors.password = 'signup.error.passwordPattern';
  }

  if (passwordConfirm === '') errors.passwordConfirm = 'signup.error.passwordConfirmRequired';
  else if (passwordConfirm !== password) errors.passwordConfirm = 'signup.error.passwordMismatch';

  if (trimmedNickname === '') errors.nickname = 'signup.error.nicknameRequired';
  else if (
    trimmedNickname.length < NICKNAME_MIN_LENGTH ||
    trimmedNickname.length > NICKNAME_MAX_LENGTH
  ) {
    errors.nickname = 'signup.error.nicknameLength';
  }

  if (!agreed) errors.agreed = 'signup.error.agreeRequired';

  return errors;
};

export const hasSignupError = (errors) => Object.values(errors).some(Boolean);
