import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import EmptyState from '../../../components/common/EmptyState';
import GoogleAttribution from '../../../features/search/components/GoogleAttribution';
import { formatShortDate } from '../../../features/member/utils/tripDates';
import { getDayDotClass } from '../tripDays';

// STEP5 "담은 장소" 바구니 — 와이어프레임 W05 "선택한 장소 바구니". DAY별로 묶어 보여준다.
// 장소 이름은 저장하지 않아서(약관) placesById로 다시 불러온 값을 쓴다. 아직 불러오는 중이면 자리 글자를 둔다.
export default function SelectedSpots({ spots, days, placesById, isGoogle, onEdit, onRemove }) {
  const { t, i18n } = useTranslation();

  if (spots.length === 0) {
    return (
      <EmptyState
        title={t('wizard.spots.basket.emptyTitle')}
        description={t('wizard.spots.basket.emptyDescription')}
        className="rounded-2xl bg-bg-soft py-8"
      />
    );
  }

  const getName = (placeId) => {
    const { place, isPending } = placesById[placeId] ?? {};
    if (place) return place.name;
    return isPending ? t('wizard.spots.basket.loadingName') : t('wizard.spots.basket.missing');
  };

  return (
    <section aria-labelledby="selected-spots-title" className="rounded-2xl bg-bg-soft p-4">
      <h2 id="selected-spots-title" className="text-body font-bold">
        {t('wizard.spots.basket.title', { count: spots.length })}
      </h2>
      <div className="mt-3 flex flex-col gap-4">
        {days.map(({ dayIndex, date }) => {
          const daySpots = spots.filter((spot) => spot.dayIndex === dayIndex);
          if (daySpots.length === 0) return null;
          return (
            <div key={dayIndex} className="flex flex-col gap-2">
              <p className="flex items-center gap-2 text-body-sm font-bold">
                <span
                  aria-hidden="true"
                  className={`size-2 rounded-full ${getDayDotClass(dayIndex)}`}
                />
                {t('wizard.spots.basket.day', {
                  day: dayIndex + 1,
                  date: formatShortDate(date, i18n.language),
                })}
              </p>
              <ul className="flex flex-col gap-2">
                {daySpots.map(({ placeId }) => {
                  const name = getName(placeId);
                  return (
                    <li
                      key={placeId}
                      className="flex items-center gap-2 rounded-xl bg-background py-1 pr-1 pl-3"
                    >
                      <span className="min-w-0 flex-1 truncate text-body-sm">{name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={!placesById[placeId]?.place}
                        onClick={() => onEdit(placeId)}
                      >
                        {t('wizard.spots.basket.change')}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={t('wizard.spots.basket.remove', { name })}
                        onClick={() => onRemove(placeId)}
                      >
                        <span aria-hidden="true">✕</span>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
      {isGoogle && <GoogleAttribution />}
    </section>
  );
}
