// 일정을 밖으로 내보낼 때(텍스트 복사·공유·인쇄) 쓰는 값 (요구사항 #72).
// 구글 장소는 약관상 구글 지도 위에서만 보여 줄 수 있어서, 이름을 내보내지 않고 name을 null로 둔다.
export function buildShareData(trip) {
  const days = trip.days.map((day) => ({
    date: day.date,
    items: day.items.map((item) => ({
      id: item.id,
      startTime: item.startTime,
      stayMinutes: item.stayMinutes,
      name: item.source === 'google' ? null : (item.name ?? null),
      memo: item.memo ?? '',
    })),
  }));
  const hasHiddenName = days.some((day) => day.items.some((item) => item.name === null));

  return {
    title: trip.title ?? '',
    startDate: trip.startDate,
    endDate: trip.endDate,
    people: trip.people,
    days,
    hasHiddenName,
  };
}
