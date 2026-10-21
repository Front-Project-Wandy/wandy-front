import Card from '../../components/common/Card';
import Header from '../../components/common/Header';
import ContinueDraftCard from './ContinueDraftCard';
import HomeHero from './HomeHero';
import TripStartForm from './TripStartForm';

// H01 홈 (A파트). 필수: 시작 영역(23) · 이어서 만들기(31).
// 헤더는 App.jsx 공통 배치가 정해지기 전까지 여기서 직접 붙인다.
export default function HomePage() {
  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-6 lg:px-6 lg:py-10">
        <section className="grid gap-6 rounded-2xl bg-bg-soft p-4 sm:p-6 lg:grid-cols-2 lg:items-center lg:gap-10 lg:p-10">
          <HomeHero />
          <Card className="p-4 sm:p-6">
            <TripStartForm />
          </Card>
        </section>
        <ContinueDraftCard />
      </main>
    </>
  );
}
