import { useTranslation } from 'react-i18next';

// 상품 사진 출처 한 줄 (Wikimedia Commons 사진). 실제 상품 사진이 아니라 그 장소의 대표 이미지라서 맨 앞에 밝힌다.
// CC BY·BY-SA는 저작자·라이선스 표시와 함께 고친 점도 적어야 해서, 4:3으로 잘라 쓴 것을 「잘라서 표시」로 남긴다.
export default function ProductPhotoCredit({ credit }) {
  const { t } = useTranslation();
  const isAttribution = /^CC BY/i.test(credit.license);

  return (
    <figcaption className="text-caption text-text/60 break-keep">
      {credit.representative ? `${t('product.detail.photo.representative')} · ` : null}
      <a href={credit.source} target="_blank" rel="noreferrer" className="underline">
        {t('product.detail.photo.author', { author: credit.author })}
      </a>
      {' · '}
      <a href={credit.licenseUrl} target="_blank" rel="noreferrer" className="underline">
        {credit.license}
      </a>
      {isAttribution ? ` · ${t('product.detail.photo.cropped')}` : null}
    </figcaption>
  );
}
