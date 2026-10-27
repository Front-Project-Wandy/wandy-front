import { useTranslation } from 'react-i18next';

const LINK_CLASS =
  'inline-flex h-11 items-center justify-center gap-1 rounded-xl border border-primary px-4 text-body font-bold text-primary transition-colors hover:bg-bg-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

// 외부 예약 사이트 링크 묶음 (49, 항공·숙소). 새 창으로 열리고, 화면 낭독기에는 "(새 창)"을 같이 읽힌다.
// links = [{ key, href }], 버튼 글자는 labelKey(key)로 번역 키를 만든다.
export default function ExternalSearchLinks({ links, labelKey }) {
  const { t } = useTranslation();
  if (links.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      {links.map((link) => (
        <a
          key={link.key}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASS}
        >
          {t(labelKey(link.key))}
          <span aria-hidden="true">↗</span>
          <span className="sr-only">{t('wizard.common.newTab')}</span>
        </a>
      ))}
    </div>
  );
}
