import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { buildShareData } from '../utils/buildShareData';
import { formatDayDate } from '../utils/formatDay';
import { formatItemLine } from '../utils/formatShareText';

// 인쇄(PDF로 저장)할 때만 보이는 일정표 (요구사항 #72). 화면에서는 숨기고, 플래너의 나머지(지도·버튼)는 인쇄할 때 숨긴다.
// 구글 장소 이름은 내보내지 않으므로 글 복사와 같은 데이터(buildShareData)를 쓴다.
export default function PrintableTrip({ trip }) {
  const { t, i18n } = useTranslation();
  const data = useMemo(() => buildShareData(trip), [trip]);

  return (
    <section className="hidden space-y-4 print:block">
      <h1 className="text-title font-bold">{data.title || t('planner.share.untitled')}</h1>
      <p className="text-body-sm">
        {t('planner.share.period', {
          start: data.startDate?.replaceAll('-', '.'),
          end: data.endDate?.replaceAll('-', '.'),
          people: data.people,
        })}
      </p>
      {data.days.map((day, index) => (
        <div key={day.date} className="space-y-1 break-inside-avoid">
          <h2 className="text-subtitle font-bold">
            {t('planner.day.title', { number: index + 1 })}
            <span className="ml-2 text-body-sm font-normal">
              {formatDayDate(day.date, i18n.language)}
            </span>
          </h2>
          {day.items.length === 0 ? (
            <p className="text-body-sm">{t('planner.share.emptyDay')}</p>
          ) : (
            <ul className="space-y-1 text-body-sm">
              {day.items.map((item) => (
                <li key={item.id}>{formatItemLine({ item, t })}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
      {data.hasHiddenName ? <p className="text-caption">{t('planner.share.googleNote')}</p> : null}
    </section>
  );
}
