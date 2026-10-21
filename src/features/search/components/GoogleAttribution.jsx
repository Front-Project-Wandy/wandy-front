import { useTranslation } from 'react-i18next';

// 구글 지도 없이 Places 내용을 보여줄 때는 출처를 표시해야 한다 (약관, 요구사항 5).
export default function GoogleAttribution() {
  const { t } = useTranslation();
  return <p className="text-right text-caption text-text/70">{t('search.attribution.google')}</p>;
}
