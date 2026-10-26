import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import TransportLeg from '../../../features/transport/components/TransportLeg';

const MARK_CLASS =
  'flex size-8 shrink-0 items-center justify-center rounded-full text-body-sm font-bold';

// 한 DAY의 "숙소 → 장소 → 이동 → 장소…" 줄 (와이어프레임 W06 "다음 장소까지 이동 비교").
// 이동 한 줄은 플래너와 같은 C파트 TransportLeg를 쓴다 (<li> pl-11로 그려져서 여기 줄도 같은 들여쓰기로 맞춘다).
// places: 그날 장소를 순서대로 [{ placeId, place }] (place는 불러오는 중이면 null)
export default function DayTimeline({
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
          <li className="flex items-center gap-3">
            <span aria-hidden="true" className={`${MARK_CLASS} bg-bg-soft text-primary`}>
              {t('wizard.nearby.stayMark')}
            </span>
            <span className="text-body-sm text-text/70">
              {t('wizard.nearby.fromStay', { name: stay.name })}
            </span>
          </li>
          {first && (
            <TransportLeg from={stay} to={first} country={country} transportMode={transportMode} />
          )}
        </>
      )}

      {places.map(({ placeId, place }, index) => {
        const next = places[index + 1]?.place;
        const name = place?.name ?? t('wizard.spots.basket.loadingName');
        return [
          <li key={placeId} className="flex items-center gap-3">
            <span className={`${MARK_CLASS} bg-primary text-white`}>{index + 1}</span>
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
          </li>,
          place && next && (
            <TransportLeg
              key={`${placeId}-leg`}
              from={place}
              to={next}
              country={country}
              transportMode={transportMode}
            />
          ),
        ];
      })}
    </ol>
  );
}
