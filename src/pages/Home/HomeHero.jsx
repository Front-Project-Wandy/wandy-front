import { useTranslation } from 'react-i18next';

// 홈 맨 위 소개 문구. 사진이 생기기 전까지는 바깥 섹션의 연한 하늘색 배경을 쓴다.
export default function HomeHero() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-title font-bold break-keep lg:text-display">{t('home.hero.title')}</h1>
      <p className="text-body text-text/70 break-keep">{t('home.hero.subtitle')}</p>
    </div>
  );
}
