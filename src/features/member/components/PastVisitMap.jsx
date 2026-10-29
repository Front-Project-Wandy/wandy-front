import { useId, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Chip from '../../../components/common/Chip';
import EmptyState from '../../../components/common/EmptyState';
import { useAllTrips } from '../../../store/plan/useAllTrips';
import MapView from '../../map/components/MapView';
import { DAY_BORDER_CLASSES, DAY_COLOR_COUNT } from '../../map/constants';
import GoogleAttribution from '../../search/components/GoogleAttribution';
import { groupVisitsByCity, toVisitDays } from '../utils/groupVisitsByCity';
import { formatShortDate, getLocalDateString } from '../utils/tripDates';

// 마이페이지 다녀온 곳 지도 (96). 끝난 여행의 장소를 도시별 지도에 모아 본다. 플랜 store는 읽기만 한다.
// 지도는 도시 하나 기준이라 도시가 여럿이면 칩으로 고른다. 여행 하나 = DAY 하나라 범례 색이 지도 마커 색과 같다.
export default function PastVisitMap() {
  const { t, i18n } = useTranslation();
  const titleId = useId();
  const trips = useAllTrips();
  const cities = useMemo(() => groupVisitsByCity(trips, getLocalDateString()), [trips]);
  const [selectedKey, setSelectedKey] = useState(null);
  // 고른 도시의 여행이 지워지면 첫 도시로 돌아간다.
  const current = cities.find((city) => city.key === selectedKey) ?? cities[0];
  const days = useMemo(() => (current ? toVisitDays(current.trips) : []), [current]);
  const hasGoogle = current?.trips.some(({ items }) =>
    items.some((item) => item.source === 'google'),
  );

  const renderTitle = (trip) =>
    trip.title || t('my.trips.cityTrip', { city: t(`common.city.${trip.city}`) });

  return (
    <section aria-labelledby={titleId} className="space-y-5">
      <h2 id={titleId} className="text-title font-bold">
        {t('my.visitMap.title')}
      </h2>
      {current ? (
        <div className="space-y-4">
          {cities.length > 1 ? (
            <div
              role="group"
              aria-label={t('my.visitMap.cityLabel')}
              className="flex gap-2 overflow-x-auto"
            >
              {cities.map((city) => (
                <Chip
                  key={city.key}
                  label={t(`common.city.${city.city}`)}
                  selected={city.key === current.key}
                  onClick={() => setSelectedKey(city.key)}
                />
              ))}
            </div>
          ) : null}
          <MapView
            country={current.country}
            city={current.city}
            days={days}
            className="h-80 lg:h-96"
          />
          <p className="text-body-sm font-bold">
            {t('my.visitMap.summary', {
              trips: current.trips.length,
              places: current.placeCount,
            })}
          </p>
          <ul
            aria-label={t('my.visitMap.legendLabel')}
            className="space-y-3 rounded-2xl border border-text/10 p-4 sm:p-5"
          >
            {current.trips.map(({ trip, items }, index) => (
              <li key={trip.id} className="flex items-center gap-2 text-body-sm">
                {/* 지도 마커가 DAY 색 테두리 원이라 범례도 같은 모양으로 그린다. */}
                <span
                  aria-hidden="true"
                  className={`size-4 shrink-0 rounded-full border-4 ${DAY_BORDER_CLASSES[index % DAY_COLOR_COUNT]}`}
                />
                <span className="min-w-0 truncate font-bold">{renderTitle(trip)}</span>
                <span className="shrink-0 text-text/70">
                  {`${formatShortDate(trip.startDate, i18n.language)} ~ ${formatShortDate(trip.endDate, i18n.language)}`}
                </span>
                <span className="ml-auto shrink-0 text-text/70">
                  {t('my.visitMap.placeCount', { count: items.length })}
                </span>
              </li>
            ))}
          </ul>
          {/* 구글 장소 좌표를 지도 밖 목록과 함께 보여 줄 때도 구글 표기를 남긴다 (약관). */}
          {hasGoogle ? <GoogleAttribution /> : null}
        </div>
      ) : (
        <EmptyState
          title={t('my.visitMap.emptyTitle')}
          description={t('my.visitMap.emptyDescription')}
          className="rounded-2xl bg-bg-soft"
        />
      )}
    </section>
  );
}
