import { useTranslation } from 'react-i18next';

// 구글 지도 없이 Places 내용을 보여줄 때는 출처를 표시해야 한다 (약관, 요구사항 5).
// 구글 규정: 로고가 어려우면 「Google Maps」 글자를 쓴다. 번역·대소문자 변경·줄바꿈 금지(translate="no"),
// 굵기 400, 크기 12~16px, 색은 흰색·#1F1F1F·#5E5E5E 중 하나 (google-text 토큰: 라이트 #5E5E5E, 다크 흰색).
// https://developers.google.com/maps/documentation/places/web-service/policies
export default function GoogleAttribution() {
  const { t } = useTranslation();
  return (
    <p
      translate="no"
      className="text-right text-caption font-normal whitespace-nowrap text-google-text"
    >
      {t('search.attribution.google')}
    </p>
  );
}
