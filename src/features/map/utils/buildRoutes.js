// DAY별 일정을 지도에 그릴 모양으로 바꾼다: [{ dayIndex, points: [{ id, lat, lng, number }] }]
// number는 목록 번호(그 DAY의 몇 번째 장소인지)와 같다. 좌표가 없는 장소는 지도에서만 빠진다.
export const buildRoutes = (days) =>
  days
    .map((day, dayIndex) => ({
      dayIndex,
      points: day.items.flatMap((item, index) =>
        Number.isFinite(item.lat) && Number.isFinite(item.lng)
          ? [{ id: item.id, lat: item.lat, lng: item.lng, number: index + 1 }]
          : [],
      ),
    }))
    .filter((route) => route.points.length > 0);
