import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { usePlaceSearch } from '../hooks/usePlaceSearch';
import CategoryChips from './CategoryChips';
import GoogleAttribution from './GoogleAttribution';
import PlaceCard from './PlaceCard';
import PlaceSearchField from './PlaceSearchField';
import StateMessage from './StateMessage';

// S01 장소 검색 (7 키워드 검색 · 8 카테고리 · 9 도시별 추천).
// 마법사 STEP5(A) 같은 화면에 넣어 쓰고, 장소를 고르면 onSelectPlace(place)를 부른다.
export default function PlaceSearchPanel({ country, city, onSelectPlace }) {
  const { t } = useTranslation();
  const titleId = useId();
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState(null);
  const debouncedKeyword = useDebouncedValue(keyword);
  const { data, isPending, isError, isFetching, isPlaceholderData, refetch, mode } = usePlaceSearch(
    { country, city, keyword: debouncedKeyword, category },
  );
  const places = data ?? [];

  const title =
    mode === 'search'
      ? t('search.result.searchTitle')
      : t('search.result.recommendTitle', { city: t(`common.city.${city}`) });

  const renderResult = () => {
    if (isPending) return <StateMessage variant="loading" />;
    if (isError) return <StateMessage variant="error" onRetry={() => refetch()} />;
    if (places.length === 0)
      return (
        <StateMessage
          variant="empty"
          title={t('search.empty.title')}
          description={t('search.empty.description')}
        />
      );
    return (
      <div className={`space-y-2 transition-opacity ${isPlaceholderData ? 'opacity-60' : ''}`}>
        <ul className="space-y-2">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} onSelect={onSelectPlace} />
          ))}
        </ul>
        {country === 'JP' ? <GoogleAttribution /> : null}
      </div>
    );
  };

  return (
    <section aria-labelledby={titleId} className="space-y-4">
      <PlaceSearchField value={keyword} onChange={setKeyword} />
      <CategoryChips value={category} onChange={setCategory} />
      <div className="flex items-baseline justify-between gap-2">
        <h2 id={titleId} className="text-subtitle font-bold">
          {title}
        </h2>
        <p role="status" aria-live="polite" className="shrink-0 text-body-sm text-text/70">
          {isFetching
            ? t('search.result.updating')
            : t('search.result.count', { count: places.length })}
        </p>
      </div>
      {renderResult()}
    </section>
  );
}
