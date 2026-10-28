import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorState from '../../../components/common/ErrorState';
import Loading from '../../../components/common/Loading';
import { AMENITY_RADIUS_M } from '../../../services/amenityService';
import { useNearbyAmenities } from '../hooks/useNearbyAmenities';

const ICON_PATHS = {
  convenience: 'M4 9h16l-1.5 11h-13L4 9Zm4 0V7a4 4 0 0 1 8 0v2M9 14h6',
  toilet:
    'M7 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM5 21v-6H4V9h6v6H9v6m6 0v-5h-2l2-7h4l2 7h-2v5M12 3v18',
  locker: 'M5 3h14v18H5V3Zm7 0v18M9 10v2m6-2v2',
};

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
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-6">
        {data.map(({ type, amenity, distance }) => (
          <li key={type} className="flex items-center gap-4 rounded-2xl bg-bg-soft p-5">
            <span
              aria-hidden="true"
              className="grid size-12 shrink-0 place-items-center rounded-full bg-background text-primary"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={ICON_PATHS[type]} />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
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
              <span className="shrink-0 rounded-full bg-background px-3 py-1 text-body-sm font-bold text-link">
                {t('place.amenity.distance', { value: distance })}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section aria-labelledby={titleId} className={`min-w-0 space-y-5 ${className}`}>
      <div>
        <h2 id={titleId} className="text-title font-bold">
          {t('place.amenity.title')}
        </h2>
        <p className="mt-1 text-body-sm text-text/70">
          {t('place.amenity.subtitle', { radius: AMENITY_RADIUS_M })}
        </p>
      </div>
      {renderList()}
    </section>
  );
}
