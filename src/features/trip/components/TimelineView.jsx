import { useTranslation } from 'react-i18next';
import GoogleAttribution from '../../search/components/GoogleAttribution';
import TimelineDay from './TimelineDay';

// 일정을 DAY별 세로 타임라인으로 보여 주는 읽기 전용 화면 (80). 목록 보기(DayList)와 같은 자리에 들어간다.
// 구글 장소를 보여 줄 때는 구글 표기를 남긴다 (약관).
export default function TimelineView({
  days,
  country,
  transportMode,
  style,
  selectedItemId,
  onSelectItem,
}) {
  const { t } = useTranslation();
  const hasGooglePlace = days.some((day) => day.items.some((item) => item.source === 'google'));

  return (
    <div className="space-y-8">
      <p className="text-body-sm text-text/70">{t('planner.timeline.hint')}</p>
      {days.map((day, index) => (
        <TimelineDay
          key={day.date}
          day={day}
          dayIndex={index}
          country={country}
          transportMode={transportMode}
          style={style}
          selectedItemId={selectedItemId}
          onSelectItem={onSelectItem}
        />
      ))}
      {hasGooglePlace ? <GoogleAttribution /> : null}
    </div>
  );
}
