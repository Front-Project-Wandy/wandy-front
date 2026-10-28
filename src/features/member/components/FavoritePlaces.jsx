import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button';
import EmptyState from '../../../components/common/EmptyState';
import ErrorState from '../../../components/common/ErrorState';
import Loading from '../../../components/common/Loading';
import GoogleAttribution from '../../search/components/GoogleAttribution';
import PlaceCard from '../../search/components/PlaceCard';
import { getPlacePath } from '../../search/place';
import { useFavoritePlaces } from '../hooks/useFavoritePlaces';

// 마이페이지 찜한 장소 (37). 카드의 ♥를 다시 누르면 바로 목록에서 빠진다.
export default function FavoritePlaces() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const titleId = useId();
  const { ids, places, isPending, isError, refetch } = useFavoritePlaces();

  const renderList = () => {
    // 찜한 장소가 모두 없어진 경우(id만 남음)도 빈 화면으로 보여 준다.
    if (ids.length === 0 || (!isPending && !isError && places.length === 0))
      return (
        <EmptyState
          title={t('my.favorites.emptyTitle')}
          description={t('my.favorites.emptyDescription')}
          className="rounded-2xl bg-bg-soft"
          action={<Button onClick={() => navigate('/places')}>{t('my.favorites.explore')}</Button>}
        />
      );
    if (isPending) return <Loading />;
    if (isError) return <ErrorState onRetry={refetch} />;
    return (
      <div className="space-y-3">
        <ul className="grid gap-3 lg:grid-cols-2">
          {places.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onSelect={(item) => navigate(getPlacePath(item))}
            />
          ))}
        </ul>
        {/* 구글 장소 데이터를 보여 줄 때는 구글 표기를 남긴다 (약관). */}
        {places.some((place) => place.source === 'google') ? <GoogleAttribution /> : null}
      </div>
    );
  };

  return (
    <section aria-labelledby={titleId} className="space-y-5">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id={titleId} className="text-title font-bold">
          {t('my.favorites.title')}
        </h2>
        {places.length > 0 ? (
          <p className="text-body-sm text-text/70">
            {t('my.favorites.count', { count: places.length })}
          </p>
        ) : null}
      </div>
      {renderList()}
    </section>
  );
}
