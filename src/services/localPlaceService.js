// 장소의 현지어 이름·주소 (요구사항 #94). 택시 기사에게 보여 주는 화면이 쓴다.
// 1단계: src/mocks/placeLocalInfo.json을 돌려준다. 2단계: 함수 안만 서버 API 호출로 바꾼다.
// 구글 장소의 이름·주소는 저장하지 않는 규칙이라, 일정에는 placeId만 있고 이 함수로 그때그때 불러온다.
import localInfo from '../mocks/placeLocalInfo.json';
import { mockRequest } from './api/mockRequest';

// placeId 'google:mock-sensoji' → { name, address } (없으면 LOCAL_INFO_NOT_FOUND 에러)
export function getLocalPlaceInfo(placeId) {
  return mockRequest(() => {
    const info = localInfo[placeId.replace(/^google:/, '')];
    if (!info) throw new Error('LOCAL_INFO_NOT_FOUND');
    return info;
  });
}
