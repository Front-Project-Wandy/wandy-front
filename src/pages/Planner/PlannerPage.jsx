import { useTranslation } from 'react-i18next';

// P01 플래너 (C파트) — 라우팅 뼈대용 자리 화면. 담당 파트가 내용을 채운다.
export default function PlannerPage() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 lg:px-6">
      <h1 className="text-title font-bold">{t('planner.page.title')}</h1>
      <p className="mt-2 text-body-sm text-text/70">{t('common.state.comingSoon')}</p>
    </main>
  );
}
