import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import { DAY_BORDER_CLASSES } from '../../../features/map/constants';
import TransportLeg from '../../../features/transport/components/TransportLeg';

const MARK_CLASS = 'grid size-8 shrink-0 place-items-center rounded-full text-body-sm font-bold';

// 한 DAY의 "숙소 → 장소 → 이동 → 장소…" 줄 (와이어프레임 W06 "다음 장소까지 이동 비교").
// 이동 한 줄은 플래너와 같은 C파트 TransportLeg를 쓴다. <ol> 바로 아래에는 <li>만 두려고
// 이동 줄을 앞 장소(또는 숙소)의 <li> 안, 그 줄 아래에 넣는다.
// 장소 번호 원은 플래너·지도 마커와 같은 모양(흰 원 + DAY 색 테두리)이라 dayIndex를 받는다.
// places: 그날 장소를 순서대로 [{ placeId, place }] (place는 불러오는 중이면 null)
export default function DayTimeline({
  dayIndex,
  places,
  stay,
  country,
  transportMode,
  onOpenRestaurants,
  onRemove,
}) {
  const { t } = useTranslation();

  if (places.length === 0) {
    return (
      <p className="py-6 text-center text-body-sm text-text/70">{t('wizard.nearby.emptyDay')}</p>
    );
  }

  const first = places[0].place;

  return (
    <ol className="flex flex-col gap-2">
      {stay && (
        <>
          <li className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className={`${MARK_CLASS} bg-bg-soft text-primary`}>
                {t('wizard.nearby.stayMark')}
              </span>
              <span className="text-body-sm text-text/70">
                {t('wizard.nearby.fromStay', { name: stay.name })}
              </span>
            </div>
            {first && (
              <TransportLeg
                from={stay}
                to={first}
                country={country}
                transportMode={transportMode}
              />
            )}
          </li>
        </>
      )}

      {places.map(({ placeId, place }, index) => {
        const next = places[index + 1]?.place;
        const name = place?.name ?? t('wizard.spots.basket.loadingName');
        return (
          <li key={placeId} className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span
                className={`${MARK_CLASS} border-4 bg-background text-text ${DAY_BORDER_CLASSES[dayIndex % DAY_BORDER_CLASSES.length]}`}
              >
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-body font-bold">{name}</span>
              <Button
                variant="secondary"
                size="sm"
                disabled={!place}
                onClick={() => onOpenRestaurants(place)}
              >
                {t('wizard.nearby.openRestaurants')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-label={t('wizard.spots.basket.remove', { name })}
                onClick={() => onRemove(placeId)}
              >
                <span aria-hidden="true">✕</span>
              </Button>
            </div>
            {place && next && (
              <TransportLeg
                from={place}
                to={next}
                country={country}
                transportMode={transportMode}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
