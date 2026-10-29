import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DepthCarousel from '../../vendor/reactbits/DepthCarousel';

// 카드 크기는 칸 너비에 맞춘다. 원본은 px 고정이라 칸을 재서 넘긴다 (사진이 4:3이라 높이는 너비의 3/4).
// 원본은 「카드 + 양옆 퍼짐 × 2 + 여백」이 칸보다 넓으면 전체를 줄이므로, 그 안에 꼭 맞는 카드 너비를 구한다.
// 좁은 화면은 퍼짐·여백을 줄여서 앞 카드를 크게 둔다.
const NARROW_WIDTH = 640;
const LAYOUT = {
  narrow: { spread: 28, fitPadding: 24 },
  wide: { spread: 90, fitPadding: 120 },
};
const MAX_CARD_WIDTH = 540;
const PHOTO_RATIO = 0.75;

// 라이트 모드 홈 히어로 배너 (React Bits Depth Carousel). 앞에 큰 사진 한 장, 뒤로 다음 사진들이 겹쳐 보인다.
// 플렉스 캐러셀(다크 모드)의 휘는 효과는 밝은 화면에서 눈이 피로해서, 사진을 왜곡하지 않는 쪽을 쓴다.
// 가운데 사진을 한 번 더 누르면 그 장소·도시로 간다. 움직임 줄이기를 켜면 원본이 자동 넘김을 끈다.
export default function HeroDepthBanner({ items, autoplay = true }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const boxRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return undefined;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  const { spread, fitPadding } = width < NARROW_WIDTH ? LAYOUT.narrow : LAYOUT.wide;
  const cardWidth = Math.round(Math.min(width - spread * 2 - fitPadding, MAX_CARD_WIDTH));
  const current = items[active];

  return (
    <div ref={boxRef} className="relative size-full">
      {width > 0 ? (
        <DepthCarousel
          items={items.map((item) => ({ ...item, image: item.src }))}
          cardWidth={cardWidth}
          cardHeight={Math.round(cardWidth * PHOTO_RATIO)}
          radius={16}
          spread={spread}
          fitPadding={fitPadding}
          tint="var(--color-bg-soft)"
          blur={3}
          tilt={14}
          autoplay={autoplay}
          autoplayDelay={4500}
          onChange={(index) => setActive(index)}
          onSelect={(_, item) => navigate(item.link)}
          labels={{
            carousel: t('home.carousel.label'),
            previous: t('home.carousel.previous'),
            next: t('home.carousel.next'),
            slides: t('home.carousel.slides'),
            slideOf: (number, total) => t('home.carousel.counter', { current: number, total }),
            goTo: (number) => t('home.carousel.goTo', { number }),
          }}
        />
      ) : null}
      {current ? (
        <p className="pointer-events-none absolute top-4 left-4 z-3001 rounded-full bg-background/90 px-3 py-1.5 text-caption font-bold text-text">
          {current.title}
          <span className="ml-2 font-normal text-text/60">
            {t('home.carousel.counter', { current: active + 1, total: items.length })}
          </span>
        </p>
      ) : null}
    </div>
  );
}
