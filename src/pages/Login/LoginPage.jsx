import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { GUEST_USER } from '../../features/member/constants';
import LoginForm from '../../features/member/components/LoginForm';
import SocialLoginButtons from '../../features/member/components/SocialLoginButtons';
import { useAuthStore } from '../../features/member/hooks/useAuthStore';

const LINK_CLASS =
  'rounded font-bold text-link underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

// M01 로그인 (B파트). 소셜 로그인(카카오·네이버·구글)을 위에, 아이디 로그인을 아래에 두고,
// 회원가입 링크와 「로그인 없이 둘러보기」(게스트)를 맨 아래에 둔다.
// 1단계는 모두 가짜 로그인이고, 실제 로그인은 백엔드가 연결되는 2단계에서 붙인다.
export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleGuest = () => {
    login(GUEST_USER);
    navigate('/');
  };

  return (
    <main className="mx-auto max-w-md px-4 py-6 lg:px-6">
      <h1 className="text-title font-bold">{t('login.page.title')}</h1>
      <p className="mt-2 mb-6 text-body-sm text-text/70">{t('login.page.description')}</p>
      <SocialLoginButtons />
      <div className="my-6 flex items-center gap-3 text-body-sm text-text/60">
        <span aria-hidden="true" className="h-px flex-1 bg-text/15" />
        {t('login.page.divider')}
        <span aria-hidden="true" className="h-px flex-1 bg-text/15" />
      </div>
      <LoginForm />
      <p className="mt-6 text-center text-body-sm text-text/70">
        {t('login.page.signupPrompt')}{' '}
        <Link to="/signup" className={LINK_CLASS}>
          {t('login.page.signupLink')}
        </Link>
      </p>
      <div className="mt-6 border-t border-text/10 pt-6 text-center">
        <Button variant="ghost" onClick={handleGuest} className="w-full">
          {t('login.page.guest')}
        </Button>
        <p className="mt-2 text-caption text-text/60">{t('login.page.guestHint')}</p>
      </div>
    </main>
  );
}
