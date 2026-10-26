import { useQuery } from '@tanstack/react-query';
import stayData from '../../../mocks/stays.json';
import { mockRequest } from '../../../services/api/mockRequest';

// 숙소 검색 목업 (B02). 실제 숙소 예약 API는 쓰지 않는다 (확장 107).
// 항공 목업과 같이 mockRequest를 거쳐서 로딩·에러 화면이 실제처럼 나온다.
export function useMockStays({ city, area }) {
  return useQuery({
    queryKey: ['mockStays', city, area],
    queryFn: () =>
      mockRequest(() => (stayData.stays[city] ?? []).filter((stay) => stay.area === area)),
    enabled: Boolean(city && area),
    staleTime: Infinity,
  });
}
