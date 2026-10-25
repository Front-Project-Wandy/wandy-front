import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// 페이지 이동은 링크여야 해서(새 탭 열기·주소 복사가 되게) Button 대신 Link를 버튼 모양으로 꾸민다.
const LINK_BASE_CLASS =
  'inline-flex h-11 items-center justify-center rounded-xl px-4 text-body font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

// 없는 주소 (A파트 공통, 요구사항 4 — 빈·에러 화면). 잘못 들어온 사람이 막다른 길에 있지 않게
// 무엇이 잘못됐는지 짧게 알리고, 갈 수 있는 곳(홈, 여행 만들기)을 바로 보여준다.
export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto flex max-w-5xl flex-col items-center px-4 py-16 text-center lg:px-6 lg:py-24">
      <p aria-hidden="true" className="text-display font-bold text-brand">
        {t('notFound.page.code')}
      </p>
      <h1 className="mt-2 text-title font-bold break-keep">{t('notFound.page.title')}</h1>
      <p className="mt-2 text-body text-text/70 break-keep">{t('notFound.page.description')}</p>
      <div className="mt-8 flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        <Link to="/" className={`${LINK_BASE_CLASS} bg-primary text-white hover:bg-primary/90`}>
          {t('notFound.action.home')}
        </Link>
        <Link
          to="/plan/new"
          className={`${LINK_BASE_CLASS} border border-primary bg-background text-primary hover:bg-bg-soft`}
        >
          {t('notFound.action.start')}
        </Link>
      </div>
    </main>
  );
}
