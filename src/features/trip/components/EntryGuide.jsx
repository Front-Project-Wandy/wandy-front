import { useTranslation } from 'react-i18next';
import entryGuide from '../../../mocks/entryGuide.json';

// 일본 여행의 입국·세관 안내 (요구사항 #92). 규정은 바뀔 수 있어서 공식 사이트 링크와 확인한 날짜를 함께 둔다.
export default function EntryGuide({ country }) {
  const { t } = useTranslation();
  const guide = entryGuide[country];

  if (!guide || guide.sections.length === 0) {
    return <p className="text-body-sm text-text/70">{t('planner.prep.entry.empty')}</p>;
  }

  return (
    <div className="space-y-4">
      {guide.sections.map((section) => (
        <section key={section.id} className="space-y-1">
          <h3 className="text-body-sm font-bold">{section.title}</h3>
          <ul className="list-disc space-y-1 pl-5 text-body-sm">
            {section.items.map((item) => (
              <li key={item} className="break-keep">
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-body-sm">
        {guide.links.map((link) => (
          <li key={link.id}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link underline"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <p className="text-caption text-text/70">
        {t('planner.prep.entry.note', { date: entryGuide.checkedAt })}
      </p>
    </div>
  );
}
