import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AiPlaceDescription from '../../features/ai/components/AiPlaceDescription';
import FavoriteButton from '../../features/member/components/FavoriteButton';
import CategoryIcon from '../../features/search/components/CategoryIcon';
import {
  CATEGORY_TONE_CLASSES,
  DEFAULT_TONE_CLASS,
} from '../../features/search/utils/categoryTone';

// 장소 상세 맨 위 큰 사진 + 이름·카테고리·평점·AI 한 줄 설명 (10·78).
// 사진은 장소 데이터의 imageUrl만 쓰고, 없거나 못 불러오면 카테고리 색 바탕에 큰 아이콘을 그린다.
export default function PlaceHero({ place }) {
  const { t } = useTranslation();
  const [failedImage, setFailedImage] = useState(null);
  const hasImage = Boolean(place.imageUrl && place.imageUrl !== failedImage);
  const categoryLabel = t(`common.category.${place.category}`);

  return (
    <header className="space-y-6 lg:space-y-8">
      {hasImage ? (
        <img
          src={place.imageUrl}
          onError={() => setFailedImage(place.imageUrl)}
          alt={place.name}
          className="aspect-4/3 w-full rounded-3xl object-cover sm:aspect-video lg:aspect-21/9"
        />
      ) : (
        <div
          aria-hidden="true"
          className={`relative isolate grid h-56 place-items-center overflow-hidden rounded-3xl sm:h-72 lg:h-96 ${CATEGORY_TONE_CLASSES[place.category] ?? DEFAULT_TONE_CLASS}`}
        >
          <span className="absolute -top-16 -left-16 -z-10 size-56 rounded-full bg-background/40 lg:size-80" />
          <span className="absolute -right-12 -bottom-20 -z-10 size-64 rounded-full bg-background/30 lg:size-96" />
          <span className="grid size-28 place-items-center rounded-full bg-background/70 lg:size-36">
            <CategoryIcon category={place.category} size={56} />
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-3">
          <p className="flex flex-wrap items-center gap-2 text-body-sm">
            <span className="rounded-full bg-bg-soft px-3 py-1 font-bold text-link">
              {categoryLabel}
            </span>
            <span className="text-text/60">{t(`common.city.${place.city}`)}</span>
            {place.rating !== null ? (
              <span className="font-bold text-point">
                <span aria-hidden="true">★ {place.rating}</span>
                <span className="sr-only">{t('search.card.rating', { rating: place.rating })}</span>
              </span>
            ) : null}
          </p>
          <h1 className="text-title font-bold break-keep sm:text-display">{place.name}</h1>
        </div>
        <FavoriteButton place={place} className="border border-text/10" />
      </div>
      <div className="max-w-3xl">
        <AiPlaceDescription place={place} />
      </div>
    </header>
  );
}
