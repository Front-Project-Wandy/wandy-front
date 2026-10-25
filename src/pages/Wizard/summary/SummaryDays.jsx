import { useTranslation } from 'react-i18next';
import GoogleAttribution from '../../../features/search/components/GoogleAttribution';
import { formatShortDate } from '../../../features/member/utils/tripDates';
import { getDayDotClass } from '../tripDays';

// STEP7 DAY별 전체 일정 (와이어프레임 W07 "DAY별 전체 일정"). 읽기만 하고, 고치려면 [이전]으로 STEP5에 간다.
// 장소 이름은 저장하지 않아서(약관) placesById로 다시 불러온 값을 쓴다.
export default function SummaryDays({ days, spots, placesById, isGoogle }) {
  const { t, i18n } = useTranslation();

  const getName = (placeId) => {
    const { place, isPending } = placesById[placeId] ?? {};
    if (place) return place.name;
    return isPending ? t('wizard.spots.basket.loadingName') : t('wizard.summary.missing');
  };

  return (
    <section aria-labelledby="summary-days-title" className="flex flex-col gap-3">
      <h2 id="summary-days-title" className="text-body font-bold">
        {t('wizard.summary.daysTitle')}
      </h2>
      <ol className="flex flex-col gap-3">
        {days.map(({ dayIndex, date }) => {
          const daySpots = spots.filter((spot) => spot.dayIndex === dayIndex);
          return (
            <li key={dayIndex} className="rounded-2xl border border-text/10 p-4">
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
              {daySpots.length > 0 ? (
                <ol className="mt-2 flex flex-col gap-1 pl-4">
                  {daySpots.map(({ placeId }, index) => (
                    <li key={placeId} className="text-body-sm">
                      <span className="mr-2 text-text/50">{index + 1}</span>
                      {getName(placeId)}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-2 pl-4 text-body-sm text-text/50">
                  {t('wizard.summary.emptyDay')}
                </p>
              )}
            </li>
          );
        })}
      </ol>
      {isGoogle && spots.length > 0 && <GoogleAttribution />}
    </section>
  );
}
