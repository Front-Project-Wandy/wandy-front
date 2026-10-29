import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Chip from '../../components/common/Chip';
import EmptyState from '../../components/common/EmptyState';
import AdminCurationTab from '../../features/admin/components/AdminCurationTab';
import AdminProductTab from '../../features/admin/components/AdminProductTab';
import AdminResetButton from '../../features/admin/components/AdminResetButton';
import { isAdmin } from '../../features/admin/utils/isAdmin';
import { useAuthStore } from '../../features/member/hooks/useAuthStore';

const TABS = ['products', 'curation'];

// /admin — 상품·추천 목록 관리 (85). 헤더 메뉴에는 두지 않고 주소로만 들어온다.
// 1단계는 설정이 이 기기에만 저장되고, 이 기기의 상품 목록·홈 추천에 바로 반영된다.
export default function AdminPage() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const [tab, setTab] = useState(TABS[0]);

  if (!isAdmin(user))
    return (
      <main className="mx-auto max-w-5xl px-4 py-16 lg:px-6">
        <EmptyState
          title={t('admin.gate.title')}
          description={t('admin.gate.description')}
          action={
            <Link
              to="/login"
              className="inline-flex h-11 items-center rounded-xl bg-primary px-4 text-body font-bold text-white hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {t('admin.gate.login')}
            </Link>
          }
        />
      </main>
    );

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pt-8 pb-16 lg:px-6 lg:pt-12 lg:pb-20">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-caption font-bold tracking-widest text-link">
            {t('admin.page.eyebrow')}
          </p>
          <h1 className="text-title font-bold break-keep lg:text-display">
            {t('admin.page.title')}
          </h1>
        </div>
        <AdminResetButton />
      </header>
      <p className="mb-6 rounded-2xl bg-gold-soft p-4 text-body-sm text-gold-ink break-keep">
        {t('admin.page.localNote')}
      </p>
      <div role="group" aria-label={t('admin.tab.label')} className="mb-6 flex gap-2">
        {TABS.map((key) => (
          <Chip
            key={key}
            label={t(`admin.tab.${key}`)}
            selected={tab === key}
            onClick={() => setTab(key)}
          />
        ))}
      </div>
      {tab === 'products' ? <AdminProductTab /> : <AdminCurationTab />}
    </main>
  );
}
