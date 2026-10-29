import { useTranslation } from 'react-i18next';
import { DAY_BORDER_CLASSES } from '../../features/map/constants';
import { formatDuration } from '../../features/transport/utils/formatTransport';
import { getStopId } from './usePublicTripPlaces';

const MARK_CLASS =
  'grid size-8 shrink-0 place-items-center rounded-full border-4 bg-background text-body-sm font-bold text-text';

// 공개 일정의 DAY별 장소 목록 (105). 번호 원은 지도 마커와 같은 모양(흰 원 + DAY 색 테두리)이다.
// 장소를 누르면 지도에서 그 장소를 강조한다(onSelect). 장소 이름은 불러오는 동안 「불러오는 중」으로 둔다.
export default function PublicTripDayList({ trip, placesById, selectedId, onSelect }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8">
      {trip.days.map((day, dayIndex) => (
        <section key={dayIndex} aria-labelledby={`community-day-${dayIndex}`}>
          <h3 id={`community-day-${dayIndex}`} className="mb-3 text-subtitle font-bold">
            {t('community.detail.day', { day: dayIndex + 1 })}
          </h3>
          <ol className="flex flex-col gap-2">
            {day.map((stop, index) => {
              const stopId = getStopId(dayIndex, index);
              const place = placesById[stop.placeId];
              const name = place?.name ?? t('community.detail.loadingName');
              return (
                <li key={stopId}>
                  <button
                    type="button"
                    aria-pressed={selectedId === stopId}
                    onClick={() => onSelect(stopId)}
                    className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-bg-soft focus-visible:outline-2 focus-visible:outline-primary ${selectedId === stopId ? 'bg-bg-soft' : ''}`}
                  >
                    <span
                      className={`${MARK_CLASS} ${DAY_BORDER_CLASSES[dayIndex % DAY_BORDER_CLASSES.length]}`}
                    >
                      {index + 1}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-body-sm font-bold text-primary">
                          {stop.startTime}
                        </span>
                        <span className="text-body font-bold break-keep">{name}</span>
                      </span>
                      <span className="text-caption text-text/60">
                        {place ? `${t(`common.category.${place.category}`)} · ` : ''}
                        {t('community.detail.stay', {
                          duration: formatDuration(t, stop.stayMinutes),
                        })}
                      </span>
                      {stop.memo ? (
                        <span className="text-body-sm text-text/80">{stop.memo}</span>
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
