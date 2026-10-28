import FavoritePlaces from '../../features/member/components/FavoritePlaces';
import MyPageSummary from '../../features/member/components/MyPageSummary';
import MyTrips from '../../features/member/components/MyTrips';
import PastPlaceRatings from '../../features/member/components/PastPlaceRatings';
import PastVisitMap from '../../features/member/components/PastVisitMap';
import ProfilePreferences from '../../features/member/components/ProfilePreferences';
import TravelProfile from '../../features/member/components/TravelProfile';

// 요약 카드의 숫자를 누르면 내려갈 섹션 자리. 섹션 안의 제목 id는 useId라 바뀌므로 감싼 div에 고정 id를 둔다.
const ANCHORS = { trips: 'my-trips', ratings: 'my-ratings', favorites: 'my-favorites' };

// M02 마이페이지 (B파트). 내 여행(36) → 다녀온 곳 평가(97) → 다녀온 곳 지도(96) → 지난 여행으로 본 취향(66)
// → 여행 취향(37) → 찜한 장소(37) 순서. 평가는 끝난 여행 목록 바로 아래에 둔다.
// 취향 카드가 여행 취향 바로 위에 있어야 [이 취향으로 설정] 결과가 아래 폼에 바로 보인다.
export default function MyPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pt-6 pb-16 lg:px-6 lg:pt-10 lg:pb-20">
      <MyPageSummary anchors={ANCHORS} />
      <div className="mt-12 flex flex-col gap-16 lg:mt-16 lg:gap-20">
        <div id={ANCHORS.trips} className="scroll-mt-8">
          <MyTrips />
        </div>
        <div id={ANCHORS.ratings} className="scroll-mt-8">
          <PastPlaceRatings />
        </div>
        <PastVisitMap />
        <TravelProfile />
        <ProfilePreferences />
        <div id={ANCHORS.favorites} className="scroll-mt-8">
          <FavoritePlaces />
        </div>
      </div>
    </main>
  );
}
