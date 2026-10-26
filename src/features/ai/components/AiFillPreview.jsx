import { useTranslation } from 'react-i18next';
import GoogleAttribution from '../../search/components/GoogleAttribution';

// AI가 채운 일정 미리보기 (55). 넣기 전에 DAY별로 시각·장소·카테고리를 보여준다.
// days: validateItinerary 결과 [{ dayIndex, items: [{ place, startTime, stayMinutes }] }]
export default function AiFillPreview({ days }) {
  const { t } = useTranslation();
  const hasGooglePlace = days.some((day) =>
    day.items.some(({ place }) => place.source === 'google'),
  );

  return (
    <div className="space-y-4">
      {days.map((day) => (
        <section key={day.dayIndex} className="space-y-2">
          <h3 className="text-body font-bold">{t('ai.fill.day', { day: day.dayIndex + 1 })}</h3>
          <ol className="space-y-1">
            {day.items.map(({ place, startTime, stayMinutes }) => (
              <li key={place.id} className="flex items-baseline gap-3 text-body-sm">
                <span className="w-12 shrink-0 font-bold text-link">{startTime}</span>
                <span className="min-w-0 flex-1 truncate">{place.name}</span>
                <span className="shrink-0 text-text/70">
                  {t(`common.category.${place.category}`)} ·{' '}
                  {t('ai.fill.stay', { minutes: stayMinutes })}
                </span>
              </li>
            ))}
          </ol>
        </section>
      ))}
      {hasGooglePlace ? <GoogleAttribution /> : null}
    </div>
  );
}
