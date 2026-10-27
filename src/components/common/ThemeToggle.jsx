import { useTranslation } from 'react-i18next';
import { useTheme } from './useTheme';

const ICON_PROPS = {
  'aria-hidden': true,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'size-5',
};

// 헤더의 라이트↔다크 전환 버튼 (89). 아이콘은 "누르면 바뀔 테마"를 보여준다 (다크일 때 해, 라이트일 때 달).
// 아이콘만 있는 버튼이라 aria-label로 무엇을 하는지 읽어 준다.
export default function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t(isDark ? 'common.header.theme.toLight' : 'common.header.theme.toDark')}
      className="inline-flex size-9 items-center justify-center rounded-xl text-text/70 transition-colors hover:bg-bg-soft hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      {isDark ? (
        <svg {...ICON_PROPS}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg {...ICON_PROPS}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
