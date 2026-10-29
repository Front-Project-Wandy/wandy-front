import { useTranslation } from 'react-i18next';
import LoginForm from '../../features/member/components/LoginForm';

// M01 로그인 (B파트). 지금은 입력 화면만 있고, 실제 로그인은 백엔드가 연결되는 2단계에서 붙인다.
export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto max-w-md px-4 py-6 lg:px-6">
      <h1 className="text-title font-bold">{t('login.page.title')}</h1>
      <p className="mt-2 mb-6 text-body-sm text-text/70">{t('login.page.description')}</p>
      <LoginForm />
    </main>
  );
}
