import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { loginWithPassword } from '../../../services/authService';
import { useAuthStore } from '../hooks/useAuthStore';

// 로그인 입력 화면 (B파트). 입력값을 검사하고, 통과하면 로그인 상태를 저장한 뒤 홈으로 보낸다.
// 입력창의 값은 useState가 들고 있고, 글자를 칠 때마다 onChange로 state를 바꾼다 (제어 컴포넌트).
// 1단계는 서버가 없어서 loginWithPassword가 가짜 사용자를 돌려준다. 2단계에서는 그 함수 안만 API 호출로 바뀐다.
export default function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const mutation = useMutation({
    mutationFn: loginWithPassword,
    onSuccess: (user) => {
      login(user);
      navigate('/');
    },
  });
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  // 칸마다 에러 문구를 따로 들고 있어서 틀린 칸 바로 아래에 보여 줄 수 있다. 비어 있으면 에러 없음.
  const [errors, setErrors] = useState({ id: '', password: '' });

  const handleSubmit = (event) => {
    // form의 기본 동작은 페이지를 새로고침하며 제출하는 것이라, 막아야 입력한 값이 사라지지 않는다.
    event.preventDefault();

    const nextErrors = {
      id: id.trim() === '' ? t('login.form.idError') : '',
      password: password === '' ? t('login.form.passwordError') : '',
    };
    setErrors(nextErrors);

    const hasError = Boolean(nextErrors.id || nextErrors.password);
    if (!hasError) mutation.mutate({ id: id.trim() });
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
      <Button type="submit" size="lg" className="w-full" loading={mutation.isPending}>
        {t('login.form.submit')}
      </Button>
      {mutation.isError ? (
        <p role="alert" className="text-body-sm text-error">
          {t('login.form.error')}
        </p>
      ) : null}
    </form>
  );
}
