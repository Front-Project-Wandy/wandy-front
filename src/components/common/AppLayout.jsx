import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useTrackRecentView } from './useTrackRecentView';

// 헤더가 있는 화면들의 공통 틀. App.jsx에서 이 레이아웃 아래에 둔 경로는
// <Outlet /> 자리에 그 경로의 화면이 들어가서, 헤더를 화면마다 따로 넣지 않아도 된다.
// 모든 화면을 감싸는 자리라서, 장소·상품 상세를 본 기록(83)도 여기서 남긴다.
export default function AppLayout() {
  useTrackRecentView();

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
