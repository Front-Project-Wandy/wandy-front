import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorState from '../../../components/common/ErrorState';
import Loading from '../../../components/common/Loading';
import { AMENITY_RADIUS_M } from '../../../services/amenityService';
import { useNearbyAmenities } from '../hooks/useNearbyAmenities';

// 장소 주변 편의시설 (73). 종류(편의점·화장실·코인락커)마다 가장 가까운 1곳과 거리를 보여 준다.
// 종류는 늘 세 칸을 다 그린다 — 없는 칸도 "근처에 없어요"로 남겨야 찾아봤다는 걸 알 수 있다.
export default function NearbyAmenities({ place, className = '' }) {
  const { t } = useTranslation();
  const titleId = useId();
  const { data, isPending, isError, refetch } = useNearbyAmenities(place);

  const renderList = () => {
    if (isPending) return <Loading />;
    if (isError) return <ErrorState onRetry={() => refetch()} />;
    return (
      <ul className="grid gap-2 sm:grid-cols-3">
        {data.map(({ type, amenity, distance }) => (
          <li
            key={type}
            className="flex items-center justify-between gap-3 rounded-2xl border border-text/10 bg-background p-4"
          >
            <span className="min-w-0">
              <span className="block text-body-sm font-bold text-link">
                {t(`place.amenity.type.${type}`)}
              </span>
              <span
                className={`block truncate text-body ${amenity ? 'font-bold' : 'text-text/70'}`}
              >
                {amenity ? amenity.name : t('place.amenity.none')}
              </span>
            </span>
            {amenity ? (
              <span className="shrink-0 rounded-full bg-bg-soft px-3 py-1 text-body-sm font-bold text-link">
                {t('place.amenity.distance', { value: distance })}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section aria-labelledby={titleId} className={`min-w-0 space-y-3 ${className}`}>
      <div>
        <h2 id={titleId} className="text-subtitle font-bold">
          {t('place.amenity.title')}
        </h2>
        <p className="text-body-sm text-text/70">
          {t('place.amenity.subtitle', { radius: AMENITY_RADIUS_M })}
        </p>
      </div>
      {renderList()}
    </section>
  );
}
