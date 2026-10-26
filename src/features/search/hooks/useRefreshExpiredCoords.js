import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { usePlanStore } from '../../../store/plan/usePlanStore';
import { findCoordsToRefresh } from '../utils/coordsCache';
import { placeQuery } from './usePlace';

// 지금 여는 여행에서 좌표가 30일이 된(또는 지워진) 구글 장소의 좌표를 placeId로 다시 받아 온다 (약관, 요구사항 5).
// 플래너처럼 여행을 여는 화면에서 한 번 부른다: useRefreshExpiredCoords(trip)
// 다시 받으면 좌표와 저장 시각(coordsCachedAt)을 바꾸고, 못 받으면 오래된 좌표를 지운다
// (지도·구간 교통은 좌표 없는 장소를 건너뛴다). 지운 좌표는 다음에 다시 열 때 또 받아 온다.
export function useRefreshExpiredCoords(trip) {
  const queryClient = useQueryClient();
  const updateItem = usePlanStore((state) => state.updateItem);
  const tripId = trip?.id;
  // 다시 받을 item이 바뀔 때만 다시 돈다 (좌표를 바꾼 뒤 목록이 비면 멈춘다)
  const refreshKey = findCoordsToRefresh(trip)
    .map(({ item }) => item.id)
    .join(',');

  useEffect(() => {
    if (!tripId || !refreshKey) return undefined;
    let cancelled = false;
    // 늦게 온 결과가 다른 여행에 들어가지 않게, 결과가 왔을 때 지금 여는 여행이 같은지 본다
    const isSameTrip = () => !cancelled && usePlanStore.getState().trip?.id === tripId;

    findCoordsToRefresh(usePlanStore.getState().trip).forEach(({ dayIndex, item }) => {
      queryClient
        .fetchQuery(placeQuery(item.placeId))
        .then((place) => {
          if (!isSameTrip()) return;
          updateItem(dayIndex, item.id, {
            lat: place.lat,
            lng: place.lng,
            coordsCachedAt: new Date().toISOString(),
          });
        })
        .catch(() => {
          if (!isSameTrip()) return;
          updateItem(dayIndex, item.id, { lat: null, lng: null });
        });
    });

    return () => {
      cancelled = true;
    };
  }, [tripId, refreshKey, queryClient, updateItem]);
}
