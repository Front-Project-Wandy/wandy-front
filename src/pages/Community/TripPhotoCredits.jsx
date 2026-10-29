import { useTranslation } from 'react-i18next';
import { getTripCover } from './publicTripUtils';

// 공개 일정 카드 사진 출처 (105). CC BY·BY-SA 사진은 작가·라이선스를 화면에 밝혀야 한다.
// 카드 전체가 링크라 카드 안에는 출처 링크를 넣을 수 없어서, 목록 아래에 접어서 모아 둔다 (홈 큐레이션과 같은 방식).
export default function TripPhotoCredits({ trips }) {
  const { t } = useTranslation();
  const credited = trips.flatMap((trip) => {
    const photo = getTripCover(trip);
    return photo ? [{ trip, photo }] : [];
  });
  if (credited.length === 0) return null;

  return (
    <details className="text-caption text-text/60">
      <summary className="cursor-pointer rounded py-2 focus-visible:outline-2 focus-visible:outline-primary">
        {t('community.photoCredits')}
      </summary>
      <p className="mb-2">{t('home.editorial.photoCropNote')}</p>
      <ul className="flex flex-col gap-2">
        {credited.map(({ trip, photo }) => (
          <li key={trip.id}>
            <a href={photo.source} target="_blank" rel="noreferrer" className="underline">
              {trip.title} — {photo.author}
            </a>
            {' · '}
            <a href={photo.licenseUrl} target="_blank" rel="noreferrer" className="underline">
              {photo.license}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
