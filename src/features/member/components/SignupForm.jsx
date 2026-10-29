import { useMutation } from '@tanstack/react-query';
import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { signup } from '../../../services/authService';
import { useAuthStore } from '../hooks/useAuthStore';
import { hasSignupError, validateSignup } from '../utils/validateSignup';

const EMPTY_ERRORS = { id: '', password: '', passwordConfirm: '', nickname: '', agreed: '' };

// 회원가입 입력 (M02). 칸마다 검사해서 틀린 칸 바로 아래에 문구를 보여 주고, 통과하면 가입 후 바로 로그인한다.
// 1단계는 가짜 요청이라 저장하지 않는다. 2단계에서는 authService의 signup 안만 API 호출로 바뀐다.
export default function SignupForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const agreeErrorId = useId();
  const [values, setValues] = useState({
    id: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
    agreed: false,
  });
  // 에러는 번역 키로 들고 있어서, 언어가 바뀌어도 문구가 따라 바뀐다.
  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: (user) => {
      login(user);
      navigate('/');
    },
    // 이미 쓰는 아이디는 아이디 칸 아래에 보여 줘야 바로 고칠 수 있다.
    onError: (error) => {
      if (error.message === 'ID_TAKEN') setErrors({ ...EMPTY_ERRORS, id: 'signup.error.idTaken' });
    },
  });

  const handleChange = (key) => (event) => {
    const value = key === 'agreed' ? event.target.checked : event.target.value;
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateSignup(values);
    setErrors(nextErrors);
    if (!hasSignupError(nextErrors)) {
      mutation.mutate({ id: values.id, nickname: values.nickname.trim() });
    }
  };

  const errorText = (key) => (errors[key] ? t(errors[key]) : '');
  const isOtherError = mutation.isError && mutation.error.message !== 'ID_TAKEN';

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input
        label={t('signup.form.idLabel')}
        value={values.id}
        onChange={handleChange('id')}
        placeholder={t('signup.form.idPlaceholder')}
        error={errorText('id')}
        autoComplete="username"
      />
      <Input
        label={t('signup.form.passwordLabel')}
        type="password"
        value={values.password}
        onChange={handleChange('password')}
        placeholder={t('signup.form.passwordPlaceholder')}
        error={errorText('password')}
        autoComplete="new-password"
      />
      <Input
        label={t('signup.form.passwordConfirmLabel')}
        type="password"
        value={values.passwordConfirm}
        onChange={handleChange('passwordConfirm')}
        placeholder={t('signup.form.passwordConfirmPlaceholder')}
        error={errorText('passwordConfirm')}
        autoComplete="new-password"
      />
      <Input
        label={t('signup.form.nicknameLabel')}
        value={values.nickname}
        onChange={handleChange('nickname')}
        placeholder={t('signup.form.nicknamePlaceholder')}
        error={errorText('nickname')}
        autoComplete="nickname"
      />
      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-2 text-body-sm">
          <input
            type="checkbox"
            checked={values.agreed}
            onChange={handleChange('agreed')}
            aria-invalid={Boolean(errors.agreed)}
            aria-describedby={errors.agreed ? agreeErrorId : undefined}
            className="mt-0.5 size-4 shrink-0 accent-primary"
          />
          <span>{t('signup.form.agree')}</span>
        </label>
        {errors.agreed ? (
          <p id={agreeErrorId} className="text-body-sm text-error">
            {errorText('agreed')}
          </p>
        ) : null}
      </div>
      <Button type="submit" size="lg" className="w-full" loading={mutation.isPending}>
        {t('signup.form.submit')}
      </Button>
      {isOtherError ? (
        <p role="alert" className="text-body-sm text-error">
          {t('signup.form.error')}
        </p>
      ) : null}
    </form>
  );
}
