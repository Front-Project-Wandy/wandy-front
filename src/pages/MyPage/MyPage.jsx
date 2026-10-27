import { useTranslation } from 'react-i18next';
import FavoritePlaces from '../../features/member/components/FavoritePlaces';
import MyTrips from '../../features/member/components/MyTrips';
import ProfilePreferences from '../../features/member/components/ProfilePreferences';

// M02 마이페이지 (B파트). 내 여행(36) → 여행 취향(37) → 찜한 장소(37) 순서.
export default function MyPage() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 lg:px-6">
      <h1 className="text-title font-bold">{t('my.page.title')}</h1>
      <MyTrips />
      <ProfilePreferences />
      <FavoritePlaces />
    </main>
  );
}
