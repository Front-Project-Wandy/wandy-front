import { useTranslation } from 'react-i18next';
import { CURATION_PHOTOS } from './curation/placePhotos';

export default function PhotoCredits({ places }) {
  const { t } = useTranslation();
  const creditedPlaces = places.filter((place) => CURATION_PHOTOS[place.id]);
  if (!creditedPlaces.length) return null;
  return (
    <details className="text-caption text-text/60">
      <summary className="cursor-pointer rounded py-2 focus-visible:outline-2 focus-visible:outline-primary">
        {t('home.editorial.placePhotoCredits')}
      </summary>
      <p className="mb-2">{t('home.editorial.photoCropNote')}</p>
      <ul className="flex flex-col gap-2">
        {creditedPlaces.map((place) => {
          const photo = CURATION_PHOTOS[place.id];
          return (
            <li key={place.id}>
              <a href={photo.source} target="_blank" rel="noreferrer" className="underline">
                {place.name} — {photo.author}
              </a>
              {' · '}
              <a href={photo.licenseUrl} target="_blank" rel="noreferrer" className="underline">
                {photo.license}
              </a>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
