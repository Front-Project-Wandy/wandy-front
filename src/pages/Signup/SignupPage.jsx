import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SignupForm from '../../features/member/components/SignupForm';

// M02 회원가입 (B파트). 아이디로 가입한다. 소셜 로그인은 2단계에서 처음 로그인할 때 자동으로 가입되어 여기에 넣지 않았다.
export default function SignupPage() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto max-w-md px-4 py-6 lg:px-6">
      <h1 className="text-title font-bold">{t('signup.page.title')}</h1>
      <p className="mt-2 mb-6 text-body-sm text-text/70">{t('signup.page.description')}</p>
      <SignupForm />
      <p className="mt-6 text-center text-body-sm text-text/70">
        {t('signup.page.loginPrompt')}{' '}
        <Link
          to="/login"
          className="rounded font-bold text-link underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t('signup.page.loginLink')}
        </Link>
      </p>
    </main>
  );
}
