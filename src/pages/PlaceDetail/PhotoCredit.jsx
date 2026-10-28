import { useTranslation } from 'react-i18next';

// 대여 사진은 CC BY·BY-SA 조건대로 작가·라이선스를 밝히고, 4:3으로 잘랐다는 것도 적는다.
// CC0·퍼블릭 도메인은 표시 의무가 없지만 작가를 같이 보여 준다. 대표 사진(그 가게가 아닌 동네·음식)이면 그렇다고 밝힌다.
const NEEDS_CHANGE_NOTE = /^CC BY/;

export default function PhotoCredit({ photo, className = '' }) {
  const { t } = useTranslation();
  const linkClass = 'underline underline-offset-2 hover:text-text';

  return (
    <p
      className={`max-w-full truncate rounded-full bg-background/85 px-3 py-1 text-caption text-text/70 ${className}`}
    >
      {photo.representative ? `${t('place.photo.representative')} · ` : null}
      {t('place.photo.by')}{' '}
      <a href={photo.source} target="_blank" rel="noreferrer" className={linkClass}>
        {photo.author}
      </a>
      {' · '}
      {photo.licenseUrl ? (
        <a href={photo.licenseUrl} target="_blank" rel="noreferrer license" className={linkClass}>
          {photo.license}
        </a>
      ) : (
        photo.license
      )}
      {NEEDS_CHANGE_NOTE.test(photo.license) ? ` · ${t('place.photo.cropped')}` : null}
    </p>
  );
}
