import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

// 로그인 입력 화면 (B파트). 아직 서버가 없어서 입력값 검사까지만 하고, 로그인 요청은 보내지 않는다.
// 입력창의 값은 useState가 들고 있고, 글자를 칠 때마다 onChange로 state를 바꾼다 (제어 컴포넌트).
// 2단계에서 로그인 API가 생기면 handleSubmit의 마지막 부분만 요청 함수 호출로 바꾸면 된다.
export default function LoginForm() {
  const { t } = useTranslation();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  // 칸마다 에러 문구를 따로 들고 있어서 틀린 칸 바로 아래에 보여 줄 수 있다. 비어 있으면 에러 없음.
  const [errors, setErrors] = useState({ id: '', password: '' });
  // 검사를 통과했을 때 안내 문구를 보여 주는 용도
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event) => {
    // form의 기본 동작은 페이지를 새로고침하며 제출하는 것이라, 막아야 입력한 값이 사라지지 않는다.
    event.preventDefault();

    const nextErrors = {
      id: id.trim() === '' ? t('login.form.idError') : '',
      password: password === '' ? t('login.form.passwordError') : '',
    };
    setErrors(nextErrors);

    const hasError = Boolean(nextErrors.id || nextErrors.password);
    setIsSubmitted(!hasError);
  };

  return (
    // noValidate: 브라우저 기본 검사 말풍선 대신 우리 에러 문구를 쓰려고 끈다.
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input
        label={t('login.form.idLabel')}
        value={id}
        onChange={(event) => setId(event.target.value)}
        placeholder={t('login.form.idPlaceholder')}
        error={errors.id}
        autoComplete="username"
      />
      <Input
        label={t('login.form.passwordLabel')}
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder={t('login.form.passwordPlaceholder')}
        error={errors.password}
        autoComplete="current-password"
      />
      <Button type="submit" size="lg" className="w-full">
        {t('login.form.submit')}
      </Button>
      {/* role="status": 안내 문구가 새로 나타나면 화면 낭독기가 읽어 준다 */}
      {isSubmitted ? (
        <p role="status" className="text-body-sm text-text/70">
          {t('login.form.demoNotice')}
        </p>
      ) : null}
    </form>
  );
}
