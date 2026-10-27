import ProductSection from '../../features/product/components/ProductSection';
import ContinueDraftCard from './ContinueDraftCard';
import HomeHero from './HomeHero';
import PopularCities from './PopularCities';
import RecentViews from './RecentViews';
import StartTripCard from './StartTripCard';
import UpcomingTripCard from './UpcomingTripCard';

// H01 홈 (A파트). 필수: 시작 영역(23, 한 줄로 만들기 56 탭 포함) · 이어서 만들기(31)
// 추가: 인기 도시(61) · 투어 상품 섹션(62) / 여유: 최근 본 장소·상품(83) · 출발 D-day(91)
// 헤더는 App.jsx의 AppLayout이 붙인다.
export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-6 lg:px-6 lg:py-10">
      <section className="grid gap-6 rounded-2xl bg-bg-soft p-4 sm:p-6 lg:grid-cols-2 lg:items-center lg:gap-10 lg:p-10">
        <HomeHero />
        <StartTripCard />
      </section>
      <UpcomingTripCard />
      <ContinueDraftCard />
      <PopularCities />
      {/* 투어 상품 섹션(62)은 B파트 컴포넌트. 나라를 넘기지 않아 한국·일본 상품을 모두 보여준다. */}
      <ProductSection />
      <RecentViews />
    </main>
  );
}
