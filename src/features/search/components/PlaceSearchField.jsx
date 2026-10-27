import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import GoogleAttribution from './GoogleAttribution';

// 키워드 검색창 (7) + 자동완성 후보 (43). 입력할 때마다 찾으므로 Enter는 키보드만 닫는다.
// suggestions: [{ placeId, name, category }]. 후보를 고르면 onPickSuggestion(후보)를 부른다.
// 키보드: ↑↓ 후보 이동, Enter 고르기, Esc 닫기 (WAI-ARIA combobox 패턴)
// showGoogleAttribution: 구글 장소 후보(JP)를 지도 없이 보여 줄 때 출처를 함께 표시한다 (약관, 5)
export default function PlaceSearchField({
  value,
  onChange,
  suggestions = [],
  onPickSuggestion,
  showGoogleAttribution = false,
}) {
  const { t } = useTranslation();
  const inputId = useId();
  const listId = useId();
  const [isFocused, setIsFocused] = useState(false);
  // 후보를 고르거나 Esc를 누르면 다음 입력 전까지 닫아 둔다
  const [isDismissed, setIsDismissed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const isOpen = isFocused && !isDismissed && value.trim() !== '' && suggestions.length > 0;
  const activeSuggestion = isOpen ? suggestions[activeIndex] : undefined;

  const handleChange = (event) => {
    setIsDismissed(false);
    setActiveIndex(-1);
    onChange(event.target.value);
  };

  const pick = (suggestion) => {
    setIsDismissed(true);
    setActiveIndex(-1);
    onPickSuggestion?.(suggestion);
  };

  const handleKeyDown = (event) => {
    if (!isOpen) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((index) => (index + step + suggestions.length) % suggestions.length);
    } else if (event.key === 'Enter' && activeSuggestion) {
      event.preventDefault();
      pick(activeSuggestion);
    } else if (event.key === 'Escape') {
      // 검색창(type=search)은 Esc에 글자를 지우는데, 후보가 열려 있을 때는 닫기만 한다
      event.preventDefault();
      setIsDismissed(true);
      setActiveIndex(-1);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.currentTarget.querySelector('input')?.blur();
  };

  return (
    <form role="search" onSubmit={handleSubmit}>
      <label htmlFor={inputId} className="mb-1 block text-body-sm font-bold">
        {t('search.field.label')}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type="search"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeSuggestion ? `${listId}-${activeIndex}` : undefined}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={t('search.field.placeholder')}
          enterKeyHint="search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="h-12 w-full rounded-xl border border-text/30 bg-background px-4 text-body placeholder:text-text/50 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        />
        <div
          hidden={!isOpen}
          className="absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-text/15 bg-background py-1 shadow-lg"
        >
          <ul id={listId} role="listbox" aria-label={t('search.suggest.listLabel')}>
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.placeId}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                // 누르는 순간 입력창 포커스가 빠져 목록이 닫히지 않도록 mousedown 기본 동작을 막는다
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => pick(suggestion)}
                className={`flex min-h-11 cursor-pointer items-center justify-between gap-3 px-4 text-body ${
                  index === activeIndex ? 'bg-bg-soft' : 'hover:bg-bg-soft'
                }`}
              >
                <span className="min-w-0 truncate">{suggestion.name}</span>
                <span className="shrink-0 text-body-sm text-text/70">
                  {t(`common.category.${suggestion.category}`)}
                </span>
              </li>
            ))}
          </ul>
          {showGoogleAttribution ? (
            <div className="px-4 pt-1">
              <GoogleAttribution />
            </div>
          ) : null}
        </div>
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {isOpen ? t('search.suggest.count', { count: suggestions.length }) : ''}
      </p>
    </form>
  );
}
