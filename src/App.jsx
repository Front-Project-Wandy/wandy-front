import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/common/AppLayout';
import IntroGate from './features/intro/components/IntroGate';
import CommunityPage from './pages/Community/CommunityPage';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Login/LoginPage';
import MyPage from './pages/MyPage/MyPage';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import PlaceDetailPage from './pages/PlaceDetail/PlaceDetailPage';
import PlacesPage from './pages/Places/PlacesPage';
import PlannerPage from './pages/Planner/PlannerPage';
import ProductsPage from './pages/Products/ProductsPage';
import SignupPage from './pages/Signup/SignupPage';
import WizardPage from './pages/Wizard/WizardPage';

// 경로는 프롬프트 MD "사용자 흐름 & 페이지 경로" 표를 따른다.
// 헤더는 AppLayout 한 곳에서 붙인다. 헤더가 있는 화면은 와이어프레임 v3 기준.
export default function App() {
  return (
    <Routes>
      {/* 홈: 첫 방문 인트로 동안 헤더도 키보드로 못 들어가게, 레이아웃째 IntroGate(inert) 안에 둔다. */}
      <Route
        element={
          <IntroGate>
            <AppLayout />
          </IntroGate>
        }
      >
        <Route path="/" element={<HomePage />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route path="/trip/:id" element={<PlannerPage />} />
        <Route path="/places" element={<PlacesPage />} />
        <Route path="/place/:id" element={<PlaceDetailPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* 마법사(W01–W07)는 와이어프레임에 헤더가 없다. 단계 이동에 집중하도록 레이아웃 밖에 둔다. */}
      <Route path="/plan/new" element={<WizardPage />} />
    </Routes>
  );
}
