import { Route, Routes } from 'react-router-dom';
import IntroGate from './features/intro/components/IntroGate';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Login/LoginPage';
import MyPage from './pages/MyPage/MyPage';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import PlaceDetailPage from './pages/PlaceDetail/PlaceDetailPage';
import PlacesPage from './pages/Places/PlacesPage';
import PlannerPage from './pages/Planner/PlannerPage';
import ProductsPage from './pages/Products/ProductsPage';
import WizardPage from './pages/Wizard/WizardPage';

// 경로는 프롬프트 MD "사용자 흐름 & 페이지 경로" 표를 따른다.
export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <IntroGate>
            <HomePage />
          </IntroGate>
        }
      />
      <Route path="/plan/new" element={<WizardPage />} />
      <Route path="/trip/:id" element={<PlannerPage />} />
      <Route path="/places" element={<PlacesPage />} />
      <Route path="/place/:id" element={<PlaceDetailPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/my" element={<MyPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
