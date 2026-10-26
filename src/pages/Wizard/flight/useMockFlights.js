import { useQuery } from '@tanstack/react-query';
import flights from '../../../mocks/flights.json';
import { mockRequest } from '../../../services/api/mockRequest';

// 항공편 검색 목업 (B01). 실제 항공 API는 쓰지 않는다 (확장 106).
// 다른 목업처럼 mockRequest를 거쳐서 로딩·에러 화면이 실제처럼 나오고, ?mockError로 실패도 볼 수 있다.
export function useMockFlights({ city, from }) {
  return useQuery({
    queryKey: ['mockFlights', city, from],
    queryFn: () =>
      mockRequest(() => (flights[city] ?? []).filter((flight) => flight.from === from)),
    enabled: Boolean(city && from),
    staleTime: Infinity,
  });
}
