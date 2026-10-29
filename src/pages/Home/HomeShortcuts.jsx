import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const SHORTCUTS = [
  { key: 'start', to: '#home-start', icon: 'M12 3v18M3 12h18M5 5l14 14M5 19 19 5' },
  {
    key: 'seoul',
    to: '/places?country=KR&city=seoul',
    icon: 'M4 21V10h16v11M2 10l10-7 10 7M9 21v-7h6v7M7 7V4m10 3V4',
  },
  {
    key: 'tokyo',
    to: '/places?country=JP&city=tokyo',
    icon: 'M12 2v4M10 6h4l3 15M10 6 7 21M6 21h12M8 14h8M9 10h6M7 18h10',
  },
  {
    key: 'products',
    to: '/products',
    icon: 'M3 5h18v5a2 2 0 0 0 0 4v5H3v-5a2 2 0 0 0 0-4V5Zm12 0v3m0 3v2m0 3v3',
  },
  {
    key: 'themes',
    to: '#home-curation',
    icon: 'M20 3C9 2 3 8 5 15s14 5 15-12ZM5 21 15 10M8 17v-5m0 5h5',
  },
  { key: 'my', to: '/my', icon: 'M8 7V4h8v3M4 7h16v14H4V7Zm4 4v6m8-6v6' },
];

export default function HomeShortcuts() {
  const { t } = useTranslation();
  return (
    <nav
      aria-label={t('home.editorial.shortcutsLabel')}
      className="grid grid-cols-3 gap-x-4 gap-y-6 py-8 sm:grid-cols-6 lg:py-12"
    >
      {SHORTCUTS.map(({ key, to, icon }) => {
        const content = (
          <>
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-bg-soft text-primary transition-transform group-hover:-translate-y-1 sm:h-20 sm:w-20">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={icon} />
              </svg>
            </span>
            <span className="text-body-sm font-bold">{t(`home.editorial.shortcuts.${key}`)}</span>
          </>
        );
        const className =
          'group flex flex-col items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-primary';
        return to.startsWith('#') ? (
          <a key={key} href={to} className={className}>
            {content}
          </a>
        ) : (
          <Link key={key} to={to} className={className}>
            {content}
          </Link>
        );
      })}
    </nav>
  );
}
