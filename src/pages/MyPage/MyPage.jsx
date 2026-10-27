import { useTranslation } from 'react-i18next';
import FavoritePlaces from '../../features/member/components/FavoritePlaces';
import MyTrips from '../../features/member/components/MyTrips';
import PastPlaceRatings from '../../features/member/components/PastPlaceRatings';
import ProfilePreferences from '../../features/member/components/ProfilePreferences';
import TravelProfile from '../../features/member/components/TravelProfile';

// M02 마이페이지 (B파트). 내 여행(36) → 다녀온 곳 평가(97) → 지난 여행으로 본 취향(66) → 여행 취향(37)
// → 찜한 장소(37) 순서. 평가는 끝난 여행 목록 바로 아래에 둔다.
// 취향 카드가 여행 취향 바로 위에 있어야 [이 취향으로 설정] 결과가 아래 폼에 바로 보인다.
export default function MyPage() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 lg:px-6">
      <h1 className="text-title font-bold">{t('my.page.title')}</h1>
      <MyTrips />
      <PastPlaceRatings />
      <TravelProfile />
      <ProfilePreferences />
      <FavoritePlaces />
    </main>
  );
}
