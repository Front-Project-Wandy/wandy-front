import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NEARBY_RADIUS_M } from '../../../services/placeService';
import GoogleAttribution from '../../search/components/GoogleAttribution';
import StateMessage from '../../search/components/StateMessage';
import { useNearbyRestaurants } from '../hooks/useNearbyRestaurants';
import { formatDistance } from '../utils/formatDistance';
import FoodTypeChips from './FoodTypeChips';
import RestaurantItem from './RestaurantItem';

// T02 주변 식당 (22) + 음식 종류 필터 (44). 장소 상세와 마법사 STEP6(A)에서 기준 장소(place)를 넘겨 쓴다.
// 다른 장소로 바뀌면 필터도 처음으로 돌아가도록, 부르는 쪽에서 key={place.id}를 준다.
export default function NearbyRestaurants({ place, onSelectPlace }) {
  const { t } = useTranslation();
  const titleId = useId();
  const [foodType, setFoodType] = useState(null);
  const { data, isPending, isError, refetch } = useNearbyRestaurants(place);
  const items = data ?? [];
  // 종류는 이미 받은 목록에서 거른다 — 칩을 바꿀 때마다 다시 요청하지 않는다.
  const visibleItems = foodType ? items.filter((item) => item.foodType === foodType) : items;
  const radius = formatDistance(NEARBY_RADIUS_M);
  const radiusText = t(`restaurant.distance.${radius.unit}`, { value: radius.value });

  const renderList = () => {
    if (isPending) return <StateMessage variant="loading" />;
    if (isError) return <StateMessage variant="error" onRetry={() => refetch()} />;
    if (items.length === 0)
      return (
        <StateMessage
          variant="empty"
          title={t('restaurant.empty.title')}
          description={t('restaurant.empty.description', { radius: radiusText })}
        />
      );
    return (
      <div className="space-y-3">
        <FoodTypeChips value={foodType} onChange={setFoodType} />
        <p role="status" aria-live="polite" className="text-body-sm text-text/70">
          {t('restaurant.list.count', { count: visibleItems.length })}
        </p>
        {visibleItems.length === 0 ? (
          <StateMessage
            variant="empty"
            title={t('restaurant.empty.filteredTitle')}
            description={t('restaurant.empty.filteredDescription')}
          />
        ) : (
          <ul className="space-y-2">
            {visibleItems.map(({ place: restaurant, distance, foodType: type }) => (
              <RestaurantItem
                key={restaurant.id}
                place={restaurant}
                distance={distance}
                foodType={type}
                onSelect={onSelectPlace}
              />
            ))}
          </ul>
        )}
        {place.country === 'JP' && visibleItems.length > 0 ? <GoogleAttribution /> : null}
      </div>
    );
  };

  return (
    <section aria-labelledby={titleId} className="min-w-0 space-y-3">
      <div>
        <h2 id={titleId} className="text-subtitle font-bold">
          {t('restaurant.section.title')}
        </h2>
        <p className="text-body-sm text-text/70">
          {t('restaurant.section.subtitle', { radius: radiusText })}
        </p>
      </div>
      {renderList()}
    </section>
  );
}
