import { useTranslation } from 'react-i18next';
import FavoritePlaces from '../../features/member/components/FavoritePlaces';
import ProfilePreferences from '../../features/member/components/ProfilePreferences';

// M02 마이페이지 (B파트). 내 여행 목록(36)은 플랜 저장 방식이 정해지면 붙인다.
export default function MyPage() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 lg:px-6">
      <h1 className="text-title font-bold">{t('my.page.title')}</h1>
      <ProfilePreferences />
      <FavoritePlaces />
    </main>
  );
}
