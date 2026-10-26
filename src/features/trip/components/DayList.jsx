import GoogleAttribution from '../../search/components/GoogleAttribution';
import DaySection from './DaySection';

// DAY 섹션들을 위에서 아래로 나열한다. 날짜는 DAY마다 하나씩이라 key로 쓴다.
export default function DayList({
  days,
  country,
  transportMode,
  flight,
  onAddPlace,
  onUpdateItem,
  onRemoveItem,
}) {
  // 구글 장소 데이터를 보여 줄 때는 구글 표기를 남긴다 (약관).
  const hasGooglePlace = days.some((day) => day.items.some((item) => item.source === 'google'));

  return (
    <div className="space-y-8">
      {days.map((day, index) => (
        <DaySection
          key={day.date}
          day={day}
          dayIndex={index}
          country={country}
          transportMode={transportMode}
          flight={flight}
          onAddPlace={onAddPlace}
          onUpdateItem={onUpdateItem}
          onRemoveItem={onRemoveItem}
        />
      ))}
      {hasGooglePlace ? <GoogleAttribution /> : null}
    </div>
  );
}
