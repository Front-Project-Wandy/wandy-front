import { useTranslation } from 'react-i18next';

// 홈 히어로 캐러셀 사진 출처. CC BY·BY-SA 사진은 작가·라이선스·변경 내용(줄이고 자름)을 밝혀야 해서 모두 적는다.
export default function HeroPhotoCredits({ items }) {
  const { t } = useTranslation();
  return (
    <details className="mt-3 px-1 text-caption text-text/60">
      <summary className="cursor-pointer rounded py-2 focus-visible:outline-2 focus-visible:outline-primary">
        {t('home.carousel.credits')}
      </summary>
      <p className="mb-2">{t('home.carousel.cropNote')}</p>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item.src}>
            <a href={item.credit.source} target="_blank" rel="noreferrer" className="underline">
              {item.title} — {item.credit.author}
            </a>
            {' · '}
            <a href={item.credit.licenseUrl} target="_blank" rel="noreferrer" className="underline">
              {item.credit.license}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
