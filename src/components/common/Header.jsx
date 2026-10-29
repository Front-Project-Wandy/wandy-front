import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../features/member/hooks/useAuthStore';
import ThemeToggle from './ThemeToggle';

// 와이어프레임 v3 공통 헤더 메뉴. to가 null이면 아직 경로가 없는 메뉴다.
const NAV_ITEMS = [
  { key: 'start', to: '/plan/new' },
  { key: 'explore', to: '/places' },
  { key: 'products', to: '/products' },
  { key: 'my', to: '/my' },
];

// 링크도 버튼과 같은 포커스 테두리를 준다 (90 접근성). 없으면 브라우저 기본 테두리가 나와 버튼과 모양이 다르다.
const FOCUS_CLASS =
  'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary';
const NAV_LINK_CLASS = `flex h-11 shrink-0 items-center rounded-xl px-3 text-body font-bold transition-colors ${FOCUS_CLASS}`;

// 메뉴(nav)는 하나만 두고 순서·너비만 바꾼다.
// 모바일: 1줄 = 로고 + 로그인, 2줄 = 메뉴(가로 스크롤) / PC(lg): 로고 · 메뉴 · 로그인 한 줄.
export default function Header() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isGuest = user?.provider === 'guest';

  return (
    <header className="border-b border-text/10 bg-background print:hidden">
      <div className="mx-auto w-full max-w-360 flex flex-wrap items-center justify-between gap-x-6 px-4 lg:px-5">
        <Link
          to="/"
          aria-label={t('common.header.homeLabel')}
          className={`flex h-16 items-center lg:h-24 rounded-xl text-title font-bold text-primary ${FOCUS_CLASS}`}
        >
          {t('common.header.logo')}
        </Link>

        <nav
          aria-label={t('common.header.navLabel')}
          className="order-last -mx-3 flex w-full overflow-x-auto [scrollbar-width:none] lg:order-none lg:mx-0 lg:w-auto lg:flex-1 lg:justify-center lg:gap-6"
        >
          {NAV_ITEMS.map(({ key, to }) =>
            to ? (
              <NavLink
                key={key}
                to={to}
                className={({ isActive }) =>
                  `${NAV_LINK_CLASS} ${key === 'start' ? 'lg:order-last lg:ml-4 lg:bg-primary lg:text-white' : ''} ${isActive ? 'text-primary' : 'text-text/70 hover:text-text'}`
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

        {/* 모바일 1줄에서 로고 반대편에 테마 버튼과 로그인(로그인했으면 이름·로그아웃)을 같이 둔다.
            게스트는 로그아웃할 것이 없어서 「게스트로 둘러보는 중」과 로그인 버튼을 보여 준다. */}
        <div className="flex min-w-0 items-center gap-2">
          <ThemeToggle />
          {isGuest ? (
            <span className="hidden text-body-sm text-text/70 sm:inline">
              {t('common.header.guest')}
            </span>
          ) : null}
          {user && !isGuest ? (
            <>
              <span className="max-w-32 truncate text-body-sm font-bold">
                {t('common.header.greeting', { name: user.name })}
              </span>
              <button
                type="button"
                onClick={logout}
                className={`inline-flex h-9 shrink-0 items-center rounded-xl border border-text/20 px-3 text-body-sm font-bold text-text/70 transition-colors hover:bg-bg-soft ${FOCUS_CLASS}`}
              >
                {t('common.header.logout')}
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={`inline-flex h-9 items-center rounded-xl border border-primary px-3 text-body font-bold text-primary transition-colors hover:bg-bg-soft ${FOCUS_CLASS}`}
            >
              {t('common.header.login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
