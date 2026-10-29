import { useTranslation } from 'react-i18next';
import { getTripCover, getTripCoverSrc } from './publicTripUtils';

// 공개 일정 상세 대표 사진과 출처 (105). 카드와 같은 사진을 쓰고, 출처 링크는 사진 바로 아래에 둔다.
// 사진은 꾸밈용이라 alt를 비운다 (제목이 바로 옆에 있다).
export default function TripCover({ trip }) {
  const { t } = useTranslation();
  const photo = getTripCover(trip);

  return (
    <figure className="flex flex-col gap-2">
      <img
        src={getTripCoverSrc(trip)}
        alt=""
        className="aspect-video w-full rounded-2xl object-cover"
      />
      {photo ? (
        <figcaption className="text-caption text-text/60">
          {t('community.detail.photoBy')}{' '}
          <a href={photo.source} target="_blank" rel="noreferrer" className="underline">
            {photo.author}
          </a>
          {' · '}
          <a href={photo.licenseUrl} target="_blank" rel="noreferrer" className="underline">
            {photo.license}
          </a>
        </figcaption>
      ) : null}
    </figure>
  );
}
