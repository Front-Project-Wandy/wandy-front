import { useTranslation } from 'react-i18next';
import EmptyState from '../../../components/common/EmptyState';
import ErrorState from '../../../components/common/ErrorState';
import Loading from '../../../components/common/Loading';
import { useFavoritePlaces } from '../../../features/member/hooks/useFavoritePlaces';
import GoogleAttribution from '../../../features/search/components/GoogleAttribution';
import PlaceCard from '../../../features/search/components/PlaceCard';

// STEP5 "찜한 장소" 탭 — 와이어프레임 W05 "찜 목록 불러오기".
// 찜은 여러 도시가 섞여 있어서, 이번 여행 도시의 장소만 보여준다.
export default function FavoriteSpots({ city, onSelectPlace }) {
  const { t } = useTranslation();
  const { places, isPending, isError, refetch } = useFavoritePlaces();
  const cityPlaces = places.filter((place) => place.city === city);

  if (isPending) return <Loading />;
  if (isError) return <ErrorState onRetry={refetch} />;
  if (cityPlaces.length === 0) {
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
        {cityPlaces.map((place) => (
          <PlaceCard key={place.id} place={place} onSelect={onSelectPlace} />
        ))}
      </ul>
      {cityPlaces.some((place) => place.source === 'google') && <GoogleAttribution />}
    </div>
  );
}
