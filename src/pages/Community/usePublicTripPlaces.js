import { useQueries } from '@tanstack/react-query';
import { placeQuery } from '../../features/search/hooks/usePlace';

const NO_DAYS = [];

// 지도·목록에서 장소 하나를 가리키는 id. 같은 장소가 다른 DAY에 다시 나와도 겹치지 않게 자리로 만든다.
export const getStopId = (dayIndex, index) => `${dayIndex}-${index}`;

// 공개 일정의 장소를 placeId로 불러온다 (105). 목업에는 id만 있고 이름·좌표는 장소 상세와 같은 캐시에서 읽는다.
// → { placesById, mapDays, isPending, isError, refetch }
// mapDays는 지도(C의 MapView)가 받는 모양 [{ items: [{ id, lat, lng }] }]이다.
// 렌더마다 새로 만들어도 MapView가 내용이 같으면 다시 그리지 않아서(useRoutes) 따로 기억해 두지 않는다.
// 일부만 실패하면 남은 장소를 보여 주고, 전부 실패했을 때만 에러로 본다 (홈 큐레이션과 같은 방식).
export function usePublicTripPlaces(trip) {
  const days = trip?.days ?? NO_DAYS;
  const placeIds = [...new Set(days.flat().map((stop) => stop.placeId))];
  const queries = useQueries({ queries: placeIds.map((id) => placeQuery(id)) });

  const placesById = Object.fromEntries(
    queries.flatMap((query, index) => (query.data ? [[placeIds[index], query.data]] : [])),
  );
  const mapDays = days.map((day, dayIndex) => ({
    items: day.flatMap((stop, index) => {
      const place = placesById[stop.placeId];
      return place ? [{ id: getStopId(dayIndex, index), lat: place.lat, lng: place.lng }] : [];
    }),
  }));

  return {
    placesById,
    mapDays,
    isPending: queries.some((query) => query.isPending),
    isError: placeIds.length > 0 && queries.every((query) => query.isError),
    refetch: () => queries.forEach((query) => query.refetch()),
  };
}
