import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { loginWithProvider } from '../../../services/authService';
import { SOCIAL_PROVIDERS } from '../constants';
import { useAuthStore } from '../hooks/useAuthStore';

// 각 서비스의 로그인 버튼 가이드를 따른다. 카카오: 배경 #FEE500, 글자 검정 85%, 모서리 12px.
// 네이버: NAVER Green(#03C75A)에 흰 글자. 구글: 흰 바탕·회색 테두리·Medium 굵기.
// 브랜드 색이라 공통 Button의 variant로는 표현할 수 없어서 기본 button을 쓴다.
const PROVIDER_CLASS = {
  kakao: 'bg-kakao font-bold text-kakao-label/85',
  naver: 'bg-naver font-bold text-white',
  google: 'border border-google-border bg-white font-medium text-google-label',
};

// 소셜 로그인 버튼 (M01). 1단계는 가짜 사용자로 로그인하고 홈으로 간다. 2단계는 authService 안만 바뀐다.
export default function SocialLoginButtons() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const mutation = useMutation({
    mutationFn: loginWithProvider,
    onSuccess: (user) => {
      login(user);
      navigate('/');
    },
  });

  return (
    <div className="flex flex-col gap-3">
      {SOCIAL_PROVIDERS.map((provider) => {
        const isPending = mutation.isPending && mutation.variables === provider;
        return (
          <button
            key={provider}
            type="button"
            onClick={() => mutation.mutate(provider)}
            disabled={mutation.isPending}
            aria-busy={isPending}
            className={`motion-press relative flex h-12 w-full items-center justify-center rounded-xl px-12 text-body focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60 ${PROVIDER_CLASS[provider]}`}
          >
            <img
              src={`/images/social/${provider}.svg`}
              alt=""
              className="absolute left-4 size-5"
            />
            {isPending ? t('login.social.pending') : t(`login.social.${provider}`)}
          </button>
        );
      })}
      {mutation.isError ? (
        <p role="alert" className="text-body-sm text-error">
          {t('login.social.error')}
        </p>
      ) : null}
    </div>
  );
}
