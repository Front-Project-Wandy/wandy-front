import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyState from '../../../components/common/EmptyState';
import { useAllTrips } from '../../../store/plan/useAllTrips';
import GoogleAttribution from '../../search/components/GoogleAttribution';
import { listPastTripPlaces } from '../utils/listPastTripPlaces';
import { formatShortDate, getLocalDateString } from '../utils/tripDates';
import PlaceRatingRow from './PlaceRatingRow';

// 마이페이지 다녀온 곳 평가 (97). 끝난 여행에 담았던 장소를 「좋았어요 / 별로였어요」로 평가하면
// 도시별 추천·AI 일정에 반영한다 (usePlaceRatingStore 주석). 플랜 store는 읽기만 한다.
export default function PastPlaceRatings() {
  const { t, i18n } = useTranslation();
  const titleId = useId();
  const groups = listPastTripPlaces(useAllTrips(), getLocalDateString());
  const hasGoogle = groups.some(({ items }) => items.some((item) => item.source === 'google'));

  const renderTitle = (trip) =>
    trip.title ||
    (trip.city
      ? t('my.trips.cityTrip', { city: t(`common.city.${trip.city}`) })
      : t('my.trips.untitled'));

  return (
    <section aria-labelledby={titleId} className="space-y-5">
      <h2 id={titleId} className="text-title font-bold">
        {t('my.ratings.title')}
      </h2>
      {groups.length === 0 ? (
        <EmptyState
          title={t('my.ratings.emptyTitle')}
          description={t('my.ratings.emptyDescription')}
          className="rounded-2xl bg-bg-soft"
        />
      ) : (
        <div className="space-y-6">
          <p className="text-body-sm text-text/70 break-keep">{t('my.ratings.notice')}</p>
          {groups.map(({ trip, items }) => (
            <div key={trip.id} className="space-y-3">
              <h3 className="text-body font-bold">
                {renderTitle(trip)}
                <span className="ml-2 text-body-sm font-normal text-text/70">
                  {`${formatShortDate(trip.startDate, i18n.language)} ~ ${formatShortDate(trip.endDate, i18n.language)}`}
                </span>
              </h3>
              <ul className="grid gap-3 lg:grid-cols-2">
                {items.map((item) => (
                  <PlaceRatingRow key={item.placeId} item={item} />
                ))}
              </ul>
            </div>
          ))}
          {/* 구글 장소 이름을 보여 줄 때는 구글 표기를 남긴다 (약관). */}
          {hasGoogle ? <GoogleAttribution /> : null}
        </div>
      )}
    </section>
  );
}
