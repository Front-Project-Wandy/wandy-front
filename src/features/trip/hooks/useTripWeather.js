import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getWeatherForecast } from '../../../services/weatherService';
import { getForecastRange } from '../utils/forecastRange';
import { getWeatherPoint } from '../utils/weatherPoint';

// 여행 날짜의 날씨 예보 (58). range.status가 'ok'일 때만 부르고, 그 밖에는 안내만 하도록 range를 그대로 돌려준다.
export function useTripWeather(trip) {
  const { startDate, endDate } = trip;
  const range = useMemo(() => getForecastRange({ startDate, endDate }), [startDate, endDate]);
  const point = getWeatherPoint(trip);
  // 좌표를 소수 둘째 자리(약 1km)까지만 키에 넣어서, 장소를 조금 옮겨도 다시 부르지 않는다
  const roundedPoint = point && { lat: point.lat.toFixed(2), lng: point.lng.toFixed(2) };

  const query = useQuery({
    queryKey: ['tripWeather', roundedPoint, range.start, range.end],
    queryFn: () =>
      getWeatherForecast({
        lat: roundedPoint.lat,
        lng: roundedPoint.lng,
        startDate: range.start,
        endDate: range.end,
      }),
    enabled: range.status === 'ok' && Boolean(point),
    staleTime: 30 * 60 * 1000,
    select: (items) => new Map(items.map((item) => [item.date, item])),
  });

  return { range, forecastByDate: query.data, ...query };
}
