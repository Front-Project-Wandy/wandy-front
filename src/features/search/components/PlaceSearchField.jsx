import { useId } from 'react';
import { useTranslation } from 'react-i18next';

// 키워드 검색창 (7). 입력할 때마다 찾으므로 Enter는 키보드만 닫는다.
export default function PlaceSearchField({ value, onChange }) {
  const { t } = useTranslation();
  const inputId = useId();

  const handleSubmit = (event) => {
    event.preventDefault();
    event.currentTarget.querySelector('input')?.blur();
  };

  return (
    <form role="search" onSubmit={handleSubmit}>
      <label htmlFor={inputId} className="mb-1 block text-body-sm font-bold">
        {t('search.field.label')}
      </label>
      <input
        id={inputId}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t('search.field.placeholder')}
        enterKeyHint="search"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className="h-12 w-full rounded-xl border border-text/30 bg-background px-4 text-body placeholder:text-text/50 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      />
    </form>
  );
}
