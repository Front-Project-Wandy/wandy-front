import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { NEARBY_RADIUS_M } from '../../../services/placeService';
import GoogleAttribution from '../../search/components/GoogleAttribution';
import StateMessage from '../../search/components/StateMessage';
import { useNearbyRestaurants } from '../hooks/useNearbyRestaurants';
import { formatDistance } from '../utils/formatDistance';
import RestaurantItem from './RestaurantItem';

// T02 주변 식당 (22). 장소 상세와 마법사 STEP6(A)에서 기준 장소(place)를 넘겨 쓴다.
export default function NearbyRestaurants({ place, onSelectPlace }) {
  const { t } = useTranslation();
  const titleId = useId();
  const { data, isPending, isError, refetch } = useNearbyRestaurants(place);
  const items = data ?? [];
  const radius = formatDistance(NEARBY_RADIUS_M);

  const renderList = () => {
    if (isPending) return <StateMessage variant="loading" />;
    if (isError) return <StateMessage variant="error" onRetry={() => refetch()} />;
    if (items.length === 0)
      return (
        <StateMessage
          variant="empty"
          title={t('restaurant.empty.title')}
          description={t('restaurant.empty.description', {
            radius: t(`restaurant.distance.${radius.unit}`, { value: radius.value }),
          })}
        />
      );
    return (
      <div className="space-y-2">
        <ul className="space-y-2">
          {items.map(({ place: restaurant, distance }) => (
            <RestaurantItem
              key={restaurant.id}
              place={restaurant}
              distance={distance}
              onSelect={onSelectPlace}
            />
          ))}
        </ul>
        {place.country === 'JP' ? <GoogleAttribution /> : null}
      </div>
    );
  };

  return (
    <section aria-labelledby={titleId} className="space-y-3">
      <div>
        <h2 id={titleId} className="text-subtitle font-bold">
          {t('restaurant.section.title')}
        </h2>
        <p className="text-body-sm text-text/70">
          {t('restaurant.section.subtitle', {
            radius: t(`restaurant.distance.${radius.unit}`, { value: radius.value }),
          })}
        </p>
      </div>
      {renderList()}
    </section>
  );
}
