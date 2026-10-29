import { useTranslation } from 'react-i18next';
import holidays from '../../../mocks/holidays.json';
import { formatDayDate } from '../utils/formatDay';
import { getTripHolidays } from '../utils/getTripHolidays';

// 여행 기간과 겹치는 공휴일·행사 (요구사항 #92). 날짜는 mocks에 넣어 둔 값이라 확인한 날짜를 같이 보여 준다.
export default function HolidayList({ trip }) {
  const { t, i18n } = useTranslation();
  const entries = getTripHolidays(trip, holidays[trip.country]);

  const formatRange = ({ start, end }) =>
    start === end
      ? formatDayDate(start, i18n.language)
      : `${formatDayDate(start, i18n.language)} ~ ${formatDayDate(end, i18n.language)}`;

  return (
    <div className="space-y-3">
      {entries.length === 0 ? (
        <p className="text-body-sm text-text/70">{t('planner.prep.holiday.empty')}</p>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li key={`${entry.type}-${entry.start}-${entry.name}`} className="text-body-sm">
              <p>
                <span className="font-bold">{entry.name}</span>
                <span className="ml-2 rounded-full border border-apricot-ink/40 px-2 text-caption text-apricot-ink">
                  {t(`planner.prep.holiday.${entry.type}`)}
                </span>
              </p>
              <p className="text-text/70">{formatRange(entry)}</p>
              {entry.note ? <p className="text-text/70 break-keep">{entry.note}</p> : null}
            </li>
          ))}
        </ul>
      )}
      <p className="text-caption text-text/70">
        {t('planner.prep.holiday.note', { date: holidays.checkedAt })}
      </p>
    </div>
  );
}
