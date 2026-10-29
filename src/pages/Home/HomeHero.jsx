import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const DESTINATIONS = ['seoul', 'tokyo'];

export default function HomeHero() {
  const { t } = useTranslation();
  const [city, setCity] = useState('seoul');

  return (
    <section
      className="relative isolate overflow-hidden rounded-2xl bg-bg-soft"
      aria-label={t('home.editorial.heroLabel')}
    >
      <div className="relative h-60 w-full sm:h-80 lg:absolute lg:inset-0 lg:-z-10 lg:h-full">
        {DESTINATIONS.map((destination) => (
          <img
            key={destination}
            src={`/images/home/${destination}.jpg`}
            alt={city === destination ? t(`home.editorial.${destination}.alt`) : ''}
            aria-hidden={city !== destination}
            className={`hero-photo absolute inset-0 size-full object-cover ${city === destination ? 'opacity-100' : 'opacity-0'}`}
            fetchPriority={destination === 'seoul' ? 'high' : 'auto'}
          />
        ))}
      </div>
      <div className="flex min-h-85 flex-col lg:min-h-150 justify-between p-5 sm:p-8 lg:p-12">
        <div
          className="flex self-start rounded-full border border-text/10 bg-background p-1"
          role="group"
          aria-label={t('home.editorial.destination')}
        >
          {DESTINATIONS.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={city === item}
              onClick={() => setCity(item)}
              className={`rounded-full px-5 py-2 text-body font-bold transition-colors focus-visible:outline-2 focus-visible:outline-primary ${city === item ? 'bg-primary text-white' : 'text-text/70 hover:bg-bg-soft'}`}
            >
              {t(`common.city.${item}`)}
            </button>
          ))}
        </div>
        <div
          key={city}
          className="motion-hero-copy mt-6 max-w-md lg:mt-16 lg:rounded-2xl lg:bg-background lg:p-8"
        >
          <p className="mb-4 text-caption font-bold tracking-widest text-primary">
            {t('home.editorial.eyebrow')}
          </p>
          <h1 className="whitespace-pre-line text-title font-bold break-keep sm:text-display">
            {t(`home.editorial.${city}.title`)}
          </h1>
          <p className="mt-4 text-body-sm leading-relaxed text-text/70 break-keep">
            {t(`home.editorial.${city}.description`)}
          </p>
          <Link
            to={`/places?country=${city === 'seoul' ? 'KR' : 'JP'}&city=${city}`}
            className="mt-6 inline-flex items-center gap-6 rounded-xl bg-primary px-5 py-3 text-body font-bold text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            {t('home.editorial.explore')} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
