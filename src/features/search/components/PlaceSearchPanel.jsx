import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Chip from '../../../components/common/Chip';
import EmptyState from '../../../components/common/EmptyState';
import ErrorState from '../../../components/common/ErrorState';
import Loading from '../../../components/common/Loading';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { usePlaceSearch } from '../hooks/usePlaceSearch';
import { usePlaceSuggestions } from '../hooks/usePlaceSuggestions';
import { isValidOrigin, sortByDistance } from '../utils/sortByDistance';
import CategoryChips from './CategoryChips';
import GoogleAttribution from './GoogleAttribution';
import PlaceCard from './PlaceCard';
import PlaceSearchField from './PlaceSearchField';

// 자동완성 후보는 결과 검색보다 빨리 떠야 도움이 돼서 기다리는 시간을 짧게 둔다
const SUGGEST_DELAY_MS = 150;

// S01 장소 검색 (7 키워드 검색 · 8 카테고리 · 9 도시별 추천 · 43 자동완성).
// 마법사 STEP5(A) 같은 화면에 넣어 쓰고, 장소를 고르면 onSelectPlace(place)를 부른다.
// preferredCategories(65)는 이번 여행 초안의 선호 카테고리. 생략하면 기존 추천 순서다.
// origin({ lat, lng, name }, 43)은 숙소, 없으면 그날 직전 장소. 넘기면 「가까운 순」을 고를 수 있다.
export default function PlaceSearchPanel({
  country,
  city,
  onSelectPlace,
  preferredCategories,
  origin = null,
}) {
  const { t, i18n } = useTranslation();
  const titleId = useId();
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState(null);
  const [sort, setSort] = useState('default');
  const debouncedKeyword = useDebouncedValue(keyword);
  const suggestKeyword = useDebouncedValue(keyword, SUGGEST_DELAY_MS);
  const { suggestions, endSession } = usePlaceSuggestions({
    country,
    city,
    keyword: suggestKeyword,
  });
  const { data, isPending, isError, isFetching, isPlaceholderData, refetch, mode } = usePlaceSearch(
    { country, city, keyword: debouncedKeyword, category, preferredCategories },
  );
  const places = data ?? [];
  const canSortByDistance = isValidOrigin(origin);
  const isDistanceSort = canSortByDistance && sort === 'distance';
  const items = isDistanceSort
    ? sortByDistance(places, origin)
    : places.map((place) => ({ place, distance: null }));

  // 도시가 없거나(city: null) 번역이 없는 도시면 'common.city.null' 같은 키가 그대로 보여서 도시 없는 제목을 쓴다.
  const cityKey = `common.city.${city}`;
  const recommendTitle =
    city && i18n.exists(cityKey)
      ? t('search.result.recommendTitle', { city: t(cityKey) })
      : t('search.result.recommendTitleNoCity');
  const title = mode === 'search' ? t('search.result.searchTitle') : recommendTitle;

  // 후보를 고르면 그 이름으로 검색해서 결과를 좁힌다. 장소를 바로 담지 않는 건
  // 화면마다 "고르기"의 뜻이 달라서다 (STEP5는 DAY를 골라야 한다).
  const handlePickSuggestion = ({ name }) => {
    setKeyword(name);
    endSession();
  };

  const renderResult = () => {
    if (isPending) return <Loading />;
    if (isError) return <ErrorState onRetry={() => refetch()} />;
    if (places.length === 0)
      return (
        <EmptyState title={t('search.empty.title')} description={t('search.empty.description')} />
      );
    return (
      <div className={`space-y-2 transition-opacity ${isPlaceholderData ? 'opacity-60' : ''}`}>
        <ul className="space-y-2">
          {items.map(({ place, distance }) => (
            <PlaceCard key={place.id} place={place} distance={distance} onSelect={onSelectPlace} />
          ))}
        </ul>
        {country === 'JP' ? <GoogleAttribution /> : null}
      </div>
    );
  };

  return (
    <section aria-labelledby={titleId} className="space-y-4">
      <PlaceSearchField
        value={keyword}
        onChange={setKeyword}
        suggestions={suggestions}
        onPickSuggestion={handlePickSuggestion}
        showGoogleAttribution={country === 'JP'}
      />
      <CategoryChips value={category} onChange={setCategory} />
      {canSortByDistance ? (
        <div className="space-y-1">
          <div role="group" aria-label={t('search.sort.label')} className="flex gap-2">
            {['default', 'distance'].map((value) => (
              <Chip
                key={value}
                label={t(`search.sort.${value}`)}
                selected={sort === value}
                onClick={() => setSort(value)}
              />
            ))}
          </div>
          {isDistanceSort && origin.name ? (
            <p className="text-body-sm text-text/70">
              {t('search.sort.from', { name: origin.name })}
            </p>
          ) : null}
        </div>
      ) : null}
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
