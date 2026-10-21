import { useTranslation } from 'react-i18next';
import { formatDistance } from '../utils/formatDistance';

// 주변 맛집 한 줄. 세부 종류를 아는 곳(한식·라멘 등)은 주소 앞에 종류를 붙인다.
export default function RestaurantItem({ place, distance, foodType, onSelect }) {
  const { t } = useTranslation();
  const { unit, value } = formatDistance(distance);
  const typeLabel = foodType && foodType !== 'other' ? t(`restaurant.foodType.${foodType}`) : null;

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(place)}
        className="relative flex w-full items-center justify-between gap-3 rounded-2xl border border-text/10 bg-background p-4 text-left transition-colors hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <span className="min-w-0">
          <span className="block truncate text-body font-bold">{place.name}</span>
          <span className="block truncate text-body-sm text-text/70">
            {typeLabel ? <span className="font-bold text-link">{typeLabel} · </span> : null}
            {place.address}
          </span>
        </span>
        <span className="shrink-0 rounded-full bg-bg-soft px-3 py-1 text-body-sm font-bold text-link">
          {t(`restaurant.distance.${unit}`, { value })}
        </span>
      </button>
    </li>
  );
}
