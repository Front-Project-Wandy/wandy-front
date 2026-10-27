import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import Chip from '../../../components/common/Chip';
import { useSuggestTripTitle } from '../hooks/useSuggestTripTitle';

// 「AI 제목 추천」 버튼 (78). 누르면 제목 후보 칩이 나오고, 고르면 onSelect(title)을 부른다.
// 마법사 STEP7: <AiTitleSuggest conditions={{ city, days, style, companion, preferredCategories }}
//   onSelect={(title) => updateDraft({ title })} />
// 제목칸에 넣을지는 부르는 쪽이 정한다. 도시가 없으면 제목을 만들 수 없어서 버튼을 막는다.
export default function AiTitleSuggest({ conditions, onSelect, className = '' }) {
  const { t } = useTranslation();
  const { mutate, data, isPending, isError } = useSuggestTripTitle();
  const [selectedTitle, setSelectedTitle] = useState(null);

  const handleSuggest = () => {
    setSelectedTitle(null);
    mutate(conditions);
  };
  const handleSelect = (title) => {
    setSelectedTitle(title);
    onSelect(title);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Button
        variant="secondary"
        size="sm"
        loading={isPending}
        disabled={!conditions?.city}
        onClick={handleSuggest}
      >
        {data ? t('ai.title.retry') : t('ai.title.button')}
      </Button>
      {isError ? (
        <p role="alert" className="text-body-sm text-error">
          {t('ai.title.error')}
        </p>
      ) : null}
      {data && !isPending ? (
        <div className="space-y-2">
          <p className="text-caption text-text/70">{t('ai.title.hint')}</p>
          <ul className="flex flex-wrap gap-2">
            {data.titles.map((title) => (
              <li key={title}>
                <Chip
                  label={title}
                  selected={selectedTitle === title}
                  onClick={() => handleSelect(title)}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
