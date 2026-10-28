import { useTranslation } from 'react-i18next';
import { CITY_PHOTOS } from '../Home/cityPhotos';
import PhotoCredit from '../PlaceDetail/PhotoCredit';
import DestinationPicker from './DestinationPicker';

// 사진과 읽는 영역을 분리해 라이트·다크 테마 모두에서 대비를 유지한다.
export default function PlacesHero({ country, city, intro, onChange }) {
  const { t } = useTranslation();
  const photo = CITY_PHOTOS[city];

  return (
    <section
      aria-labelledby="places-hero-title"
      className="overflow-hidden rounded-3xl border border-text/10 bg-bg-soft"
    >
      <div className="grid sm:grid-cols-12">
        <div className="flex flex-col justify-center px-6 py-8 sm:col-span-5 sm:px-8 lg:px-10">
          <div key={city} className="motion-hero-copy">
            <p className="flex items-center gap-3 text-caption font-bold tracking-widest text-link">
              <span aria-hidden="true" className="h-px w-6 bg-primary" />
              {t('places.page.title')} · {t(`common.country.${country}`)}
            </p>
            <h1 id="places-hero-title" className="places-city-title mt-5 font-bold tracking-tight">
              {t(`common.city.${city}`)}
            </h1>
            <p className="mt-5 max-w-sm text-body-sm leading-relaxed text-text/70 break-keep">
              {intro}
            </p>
          </div>
        </div>
        <div className="relative order-first h-52 overflow-hidden bg-background sm:order-last sm:col-span-7 sm:h-80 lg:h-88">
          {Object.keys(CITY_PHOTOS)
            .filter((name) => name === 'seoul' || name === 'tokyo' || name === city)
            .map((name) => (
              <img
                key={name}
                src={`/images/home/${name}.jpg`}
                alt={name === city ? t(`home.editorial.${name}.alt`) : ''}
                aria-hidden={name !== city}
                className={`hero-photo absolute inset-0 size-full object-cover ${name === city ? 'opacity-100' : 'opacity-0'}`}
                fetchPriority={name === city ? 'high' : 'auto'}
              />
            ))}
          {photo ? (
            <div className="absolute right-3 bottom-3 left-3 flex justify-end">
              <PhotoCredit photo={photo} />
            </div>
          ) : null}
        </div>
      </div>
      <div className="border-t border-text/10 bg-background px-6 py-5 sm:px-8 lg:px-10">
        <DestinationPicker country={country} city={city} onChange={onChange} />
      </div>
    </section>
  );
}
