import { useTranslation } from 'react-i18next';
import ProductSection from '../../features/product/components/ProductSection';
import ContinueDraftCard from './ContinueDraftCard';
import CurationSection from './CurationSection';
import HomeFlightPath from './HomeFlightPath';
import HomeHero from './HomeHero';
import HomeShortcuts from './HomeShortcuts';
import LastTripBanner from './LastTripBanner';
import PopularCities from './PopularCities';
import RecentViews from './RecentViews';
import StartTripCard from './StartTripCard';
import UpcomingTripCard from './UpcomingTripCard';
import { useHomeReveal } from './useHomeReveal';
import { CITY_PHOTOS } from './cityPhotos';

export default function HomePage() {
  const { t } = useTranslation();
  const revealRef = useHomeReveal();
  return (
    <main ref={revealRef} className="relative">
      <HomeFlightPath />
      <div
        data-flight-stop="hero"
        className="mx-auto w-full max-w-360 px-4 pt-6 lg:px-5 lg:pt-10"
      >
        <HomeHero />
        <HomeShortcuts />
        <div className="flex flex-col gap-4 empty:hidden">
          <UpcomingTripCard />
          <ContinueDraftCard />
          <LastTripBanner />
        </div>
      </div>
      <div
        data-reveal=""
        data-flight-stop="cities"
        className="mx-auto w-full max-w-360 px-4 py-12 lg:px-5 lg:py-20"
      >
        <PopularCities />
      </div>
      <section id="home-start" data-flight-stop="plan" className="scroll-mt-8 bg-bg-soft">
        <div className="mx-auto w-full max-w-360 grid gap-8 px-4 py-12 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-5 lg:py-20">
          <div>
            <p className="mb-4 text-caption font-bold tracking-widest text-primary">
              {t('home.editorial.startEyebrow')}
            </p>
            <h2 className="whitespace-pre-line text-display font-bold break-keep">
              {t('home.editorial.startTitle')}
            </h2>
            <p className="mt-5 max-w-sm text-body leading-relaxed text-text/70">
              {t('home.editorial.startDescription')}
            </p>
            <ol className="mt-8 flex flex-col gap-4">
              {['destination', 'places', 'schedule'].map((step, index) => (
                <li key={step} className="flex items-center gap-4 text-body-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/20 text-primary">
                    {index + 1}
                  </span>
                  {t(`home.editorial.steps.${step}`)}
                </li>
              ))}
            </ol>
          </div>
          <StartTripCard />
        </div>
      </section>
      <div
        id="home-curation"
        data-reveal=""
        data-flight-stop="curation"
        className="mx-auto w-full max-w-360 scroll-mt-8 px-4 py-12 lg:px-5 lg:py-20"
      >
        <CurationSection />
      </div>
      <div data-flight-stop="products" className="border-y border-text/10 bg-bg-soft">
        <div data-reveal="" className="mx-auto w-full max-w-360 px-4 py-12 lg:px-5 lg:py-20">
          <ProductSection variant="featured" />
        </div>
      </div>
      <div className="mx-auto w-full max-w-360 px-4 py-12 empty:hidden lg:px-5">
        <RecentViews />
      </div>
      <section
        data-flight-stop="arrive"
        className="mx-auto w-full max-w-360 px-4 py-12 lg:px-5 lg:py-16"
        aria-labelledby="home-outro-title"
      >
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-bg-soft p-6 sm:p-10 lg:flex-row lg:items-center">
          <div>
            <p className="mb-3 text-caption font-bold tracking-widest text-primary">
              {t('home.editorial.outroEyebrow')}
            </p>
            <h2 id="home-outro-title" className="text-title font-bold break-keep">
              {t('home.editorial.outroTitle')}
            </h2>
            <p className="mt-3 text-body-sm text-text/70">{t('home.editorial.outroDescription')}</p>
          </div>
          <a
            href="#home-start"
            className="inline-flex shrink-0 items-center gap-8 rounded-xl bg-primary px-6 py-4 text-body font-bold text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            {t('home.editorial.shortcuts.start')}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
      <footer className="border-t border-text/10">
        <div className="mx-auto w-full max-w-360 flex flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between lg:px-5">
          <div>
            <p className="text-title font-bold tracking-tight text-primary">
              {t('common.header.logo')}
            </p>
            <p className="mt-2 text-body-sm text-text/60">{t('home.editorial.footer')}</p>
          </div>
          <div className="max-w-xl text-caption text-text/50">
            <p>
              {t('home.editorial.photoCredit')}{' '}
              {Object.entries(CITY_PHOTOS).map(([city, photo], index) => (
                <span key={city}>
                  {index > 0 ? ' · ' : null}
                  <a className="underline" href={photo.source} target="_blank" rel="noreferrer">
                    {t(`common.city.${city}`)} {photo.author}
                  </a>{' '}
                  (
                  <a className="underline" href={photo.licenseUrl} target="_blank" rel="noreferrer">
                    {photo.license}
                  </a>
                  )
                </span>
              ))}
            </p>
            <p className="mt-1">{t('home.editorial.cityPhotoNote')}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
