import { useTranslation } from 'react-i18next';
import { formatDistance } from '../utils/formatDistance';

export default function RestaurantItem({ place, distance, onSelect }) {
  const { t } = useTranslation();
  const { unit, value } = formatDistance(distance);

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(place)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-text/10 bg-background p-4 text-left transition-colors hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <span className="min-w-0">
          <span className="block truncate text-body font-bold">{place.name}</span>
          <span className="block truncate text-body-sm text-text/70">{place.address}</span>
        </span>
        <span className="shrink-0 rounded-full bg-bg-soft px-3 py-1 text-body-sm font-bold text-link">
          {t(`restaurant.distance.${unit}`, { value })}
        </span>
      </button>
    </li>
  );
}
