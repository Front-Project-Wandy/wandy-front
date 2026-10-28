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
import PlacePhotoCard from './PlacePhotoCard';
import PlaceSearchField from './PlaceSearchField';

// 자동완성 후보는 결과 검색보다 빨리 떠야 도움이 돼서 기다리는 시간을 짧게 둔다
const SUGGEST_DELAY_MS = 150;
// 그리드(장소 탐색)는 사진 카드가 커서 처음에 두 줄(lg 4열)만 보여 주고 [더보기]로 늘린다
const GRID_PAGE_SIZE = 8;
// 「1위·2위·3위」 배지는 추천 순서일 때 앞쪽 몇 곳에만 붙인다
const RANK_BADGE_COUNT = 3;

// S01 장소 검색 (7 키워드 검색 · 8 카테고리 · 9 도시별 추천 · 43 자동완성).
// 마법사 STEP5(A) 같은 화면에 넣어 쓰고, 장소를 고르면 onSelectPlace(place)를 부른다.
// preferredCategories(65)는 이번 여행 초안의 선호 카테고리. 생략하면 기존 추천 순서다.
// origin({ lat, lng, name }, 43)은 숙소, 없으면 그날 직전 장소. 넘기면 「가까운 순」을 고를 수 있다.
// layout="grid"는 장소 탐색(/places)의 사진 카드 그리드다. 마법사·일정 추가 모달은 좁은 칸이라 기본 목록을 쓴다.
export default function PlaceSearchPanel({
  country,
  city,
  onSelectPlace,
  preferredCategories,
  origin = null,
  layout = 'list',
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
  const isGrid = layout === 'grid';
  // 검색어·카테고리·정렬이 바뀌면 [더보기]로 늘린 개수를 처음으로 되돌린다 (key가 다르면 기본 개수).
  const listKey = `${debouncedKeyword}|${category}|${sort}`;
  const [more, setMore] = useState({ key: listKey, count: GRID_PAGE_SIZE });
  const visibleCount = more.key === listKey ? more.count : GRID_PAGE_SIZE;
  const visibleItems = isGrid ? items.slice(0, visibleCount) : items;
  const showRank = mode === 'recommend' && !isDistanceSort;

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
        {isGrid ? (
          <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
            {visibleItems.map(({ place, distance }, index) => (
              <PlacePhotoCard
                key={place.id}
                place={place}
                distance={distance}
                rank={showRank && index < RANK_BADGE_COUNT ? index + 1 : null}
                onSelect={onSelectPlace}
              />
            ))}
          </ul>
        ) : (
          <ul className="space-y-2">
            {items.map(({ place, distance }) => (
              <PlaceCard
                key={place.id}
                place={place}
                distance={distance}
                onSelect={onSelectPlace}
              />
            ))}
          </ul>
        )}
        {country === 'JP' ? <GoogleAttribution /> : null}
        {isGrid && visibleCount < items.length ? (
          <div className="flex justify-center pt-8">
            <button
              type="button"
              onClick={() => setMore({ key: listKey, count: visibleCount + GRID_PAGE_SIZE })}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-text/15 bg-background px-8 text-body-sm font-bold transition-colors hover:bg-bg-soft focus-visible:outline-2 focus-visible:outline-primary"
            >
              {t('places.list.more')}
              <span className="text-text/60">
                {t('places.list.moreCount', { shown: visibleCount, total: items.length })}
              </span>
            </button>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <section aria-labelledby={titleId} className={isGrid ? 'space-y-6' : 'space-y-4'}>
      <PlaceSearchField
        value={keyword}
        onChange={setKeyword}
        suggestions={suggestions}
        onPickSuggestion={handlePickSuggestion}
        showGoogleAttribution={country === 'JP'}
      />
      <CategoryChips value={category} onChange={setCategory} variant={isGrid ? 'icon' : 'chip'} />
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
      <div
        className={`flex items-baseline justify-between gap-2 ${isGrid ? 'border-t border-text/10 pt-8 lg:pt-12' : ''}`}
      >
        <h2
          id={titleId}
          className={isGrid ? 'text-title font-bold lg:text-display' : 'text-subtitle font-bold'}
        >
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
