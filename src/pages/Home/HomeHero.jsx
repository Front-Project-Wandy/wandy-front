import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useDocumentTheme } from '../../components/common/useDocumentTheme';
import { useIntroPlaying } from '../../features/intro/hooks/useIntroPlaying';
import FlexCarousel from '../../vendor/reactbits/FlexCarousel';
import { HERO_CAROUSEL_ITEMS } from './heroCarouselItems';
import HeroDepthBanner from './HeroDepthBanner';
import HeroPhotoCredits from './HeroPhotoCredits';
import { useCarouselSupport } from './useCarouselSupport';

const DESTINATIONS = ['seoul', 'tokyo'];

// 홈 히어로: 서울·도쿄 사진 캐러셀 + 도시 소개 글. 모바일은 캐러셀 아래에 글, lg부터 왼쪽 글·오른쪽 캐러셀.
// 다크 모드는 가장자리가 휘는 Flex Carousel, 라이트 모드는 사진을 왜곡하지 않는 Depth Carousel(HeroDepthBanner)이다.
// 휘는 효과가 밝은 화면에서는 눈이 피로해서 나눴다. 헤더에서 테마를 바꾸면 바로 갈아 끼운다.
// 가운데 사진을 누르면 그 장소·도시로 간다. 휠은 페이지 스크롤에 남겨 둔다(captureWheel 끔).
// 다크 모드에서 움직임 줄이기를 켰거나 WebGL이 없으면 Depth Carousel로 대신한다.
// 첫 방문 인트로가 도는 동안은 자동 넘김을 멈추고, 끝나면 첫 사진부터 다시 그린다 (노트북 화면 속 사진과 맞춘다).
export default function HomeHero() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const canAnimate = useCarouselSupport();
  const theme = useDocumentTheme();
  const introPlaying = useIntroPlaying();
  const [city, setCity] = useState('seoul');
  // 서울·도쿄 버튼으로 고른 도시의 사진만 보여 준다. 섞어 보여 주면 글은 서울인데 사진은 도쿄라 구분이 안 된다.
  const cityItems = HERO_CAROUSEL_ITEMS.filter((item) => item.city === city);

  return (
    <section aria-label={t('home.editorial.heroLabel')}>
      <div className="grid overflow-hidden rounded-2xl bg-bg-soft lg:grid-cols-5">
        <div className="relative h-84 text-text sm:h-100 lg:order-2 lg:col-span-3 lg:h-150">
          {theme === 'dark' && canAnimate ? (
            <FlexCarousel
              key={`${city}-${introPlaying}`}
              items={cityItems}
              fit="landscape"
              cardHeight={0.6}
              radius={16}
              autoplay={!introPlaying}
              interval={4}
              captions
              focusOnClick={false}
              captureWheel={false}
              onSelect={(_, item) => navigate(item.link)}
              ariaLabel={t('home.carousel.label')}
              formatStatus={(title, current, total) =>
                `${title}, ${t('home.carousel.counter', { current, total })}`
              }
            />
          ) : (
            <HeroDepthBanner
              key={`${city}-${introPlaying}`}
              items={cityItems}
              autoplay={!introPlaying}
            />
          )}
        </div>
        <div className="flex flex-col gap-6 p-5 sm:p-8 lg:col-span-2 lg:justify-center lg:p-12">
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
          <div key={city} className="motion-hero-copy">
            <p className="mb-4 text-caption font-bold tracking-widest text-link">
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
      </div>
      <HeroPhotoCredits items={HERO_CAROUSEL_ITEMS} />
    </section>
  );
}
