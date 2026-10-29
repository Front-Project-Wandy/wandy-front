import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Chip from '../../../components/common/Chip';
import phraseGroups from '../../../mocks/phrases.json';
import PhraseShowDialog from './PhraseShowDialog';

// 상황별 일본어 회화 카드 (요구사항 #92). 문장을 누르면 크게 띄워서 상대에게 보여 줄 수 있다.
export default function PhraseCards({ country }) {
  const { t } = useTranslation();
  const groups = phraseGroups[country] ?? [];
  const [groupId, setGroupId] = useState(groups[0]?.id ?? null);
  // 크게 띄운 문장. 없으면 null.
  const [shown, setShown] = useState(null);

  if (groups.length === 0) {
    return <p className="text-body-sm text-text/70">{t('planner.prep.phrase.empty')}</p>;
  }

  const group = groups.find((item) => item.id === groupId) ?? groups[0];

  return (
    <div className="space-y-3">
      <div
        role="group"
        aria-label={t('planner.prep.phrase.groupLabel')}
        className="flex flex-wrap gap-2"
      >
        {groups.map((item) => (
          <Chip
            key={item.id}
            label={item.title}
            selected={item.id === group.id}
            onClick={() => setGroupId(item.id)}
          />
        ))}
      </div>
      {group.tip ? <p className="text-body-sm font-bold text-apricot-ink">{group.tip}</p> : null}
      <ul className="space-y-2">
        {group.phrases.map((phrase) => (
          <li key={phrase.id}>
            <button
              type="button"
              onClick={() => setShown(phrase)}
              aria-label={t('planner.prep.phrase.showLabel', { text: phrase.ko })}
              className="w-full rounded-2xl border border-text/10 bg-background p-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span className="block text-body-sm text-text/70">{phrase.ko}</span>
              <span lang="ja" className="block text-subtitle font-bold break-keep">
                {phrase.ja}
              </span>
              <span className="block text-body-sm text-text/70">{phrase.reading}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="text-caption text-text/70">{t('planner.prep.phrase.hint')}</p>
      <PhraseShowDialog phrase={shown} onClose={() => setShown(null)} />
    </div>
  );
}
