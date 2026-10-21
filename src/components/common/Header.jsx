import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';

// 와이어프레임 v3 공통 헤더 메뉴. to가 null이면 아직 경로가 없는 메뉴다.
// 장소 탐색은 검색 페이지 경로가 정해지면(B파트) to만 채우면 된다.
const NAV_ITEMS = [
  { key: 'start', to: '/plan/new' },
  { key: 'explore', to: null },
  { key: 'products', to: '/products' },
  { key: 'my', to: '/my' },
];

const NAV_LINK_CLASS = 'flex h-11 shrink-0 items-center px-3 text-body font-bold transition-colors';

// 메뉴(nav)는 하나만 두고 순서·너비만 바꾼다.
// 모바일: 1줄 = 로고 + 로그인, 2줄 = 메뉴(가로 스크롤) / PC(lg): 로고 · 메뉴 · 로그인 한 줄.
export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="border-b border-text/10 bg-background">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 px-4 lg:px-6">
        <Link
          to="/"
          aria-label={t('common.header.homeLabel')}
          className="flex h-14 items-center text-subtitle font-bold text-primary"
        >
          {t('common.header.logo')}
        </Link>

        <nav
          aria-label={t('common.header.navLabel')}
          className="order-last -mx-3 flex w-full overflow-x-auto [scrollbar-width:none] lg:order-none lg:mx-0 lg:w-auto lg:flex-1"
        >
          {NAV_ITEMS.map(({ key, to }) =>
            to ? (
              <NavLink
                key={key}
                to={to}
                className={({ isActive }) =>
                  `${NAV_LINK_CLASS} ${isActive ? 'text-primary' : 'text-text/70 hover:text-text'}`
                }
              >
                {t(`common.header.nav.${key}`)}
              </NavLink>
            ) : (
              <span key={key} aria-disabled="true" className={`${NAV_LINK_CLASS} text-text/30`}>
                {t(`common.header.nav.${key}`)}
              </span>
            ),
          )}
        </nav>

        <Link
          to="/login"
          className="inline-flex h-9 items-center rounded-xl border border-primary px-3 text-body font-bold text-primary transition-colors hover:bg-bg-soft"
        >
          {t('common.header.login')}
        </Link>
      </div>
    </header>
  );
}
