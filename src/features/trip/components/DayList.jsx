import DaySection from './DaySection';

// DAY 섹션들을 위에서 아래로 나열한다. 날짜는 DAY마다 하나씩이라 key로 쓴다.
export default function DayList({ days }) {
  return (
    <div className="space-y-8">
      {days.map((day, index) => (
        <DaySection key={day.date} day={day} dayIndex={index} />
      ))}
    </div>
  );
}
