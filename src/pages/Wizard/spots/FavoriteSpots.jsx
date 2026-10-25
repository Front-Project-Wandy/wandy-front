import { useTranslation } from 'react-i18next';
import EmptyState from '../../../components/common/EmptyState';
import ErrorState from '../../../components/common/ErrorState';
import Loading from '../../../components/common/Loading';
import GoogleAttribution from '../../../features/search/components/GoogleAttribution';
import PlaceCard from '../../../features/search/components/PlaceCard';

// STEP5 "찜한 장소" 탭 — 와이어프레임 W05 "찜 목록 불러오기".
// 이번 여행 도시로 거른 찜(places)은 부모가 넘겨준다. 탭 숫자도 같은 목록으로 세야 서로 맞기 때문이다.
export default function FavoriteSpots({
  city,
  places,
  isPending,
  isError,
  onRetry,
  onSelectPlace,
}) {
  const { t } = useTranslation();

  if (isPending) return <Loading />;
  if (isError) return <ErrorState onRetry={onRetry} />;
  if (places.length === 0) {
    return (
      <EmptyState
        title={t('wizard.spots.favorites.emptyTitle', { city: t(`common.city.${city}`) })}
        description={t('wizard.spots.favorites.emptyDescription')}
      />
    );
  }

  return (
    <div className="space-y-2">
      <ul className="space-y-2">
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} onSelect={onSelectPlace} />
        ))}
      </ul>
      {places.some((place) => place.source === 'google') && <GoogleAttribution />}
    </div>
  );
}
