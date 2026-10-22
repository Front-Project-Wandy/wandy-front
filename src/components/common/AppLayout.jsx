import { Outlet } from 'react-router-dom';
import Header from './Header';

// 헤더가 있는 화면들의 공통 틀. App.jsx에서 이 레이아웃 아래에 둔 경로는
// <Outlet /> 자리에 그 경로의 화면이 들어가서, 헤더를 화면마다 따로 넣지 않아도 된다.
export default function AppLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
