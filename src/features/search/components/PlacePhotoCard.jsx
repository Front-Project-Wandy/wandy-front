import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FavoriteButton from '../../member/components/FavoriteButton';
import { formatDistance } from '../../restaurant/utils/formatDistance';
import { CATEGORY_TONE_CLASSES, DEFAULT_TONE_CLASS } from '../utils/categoryTone';
import CategoryIcon from './CategoryIcon';

// 장소 탐색(/places) 그리드용 큰 사진 카드. 목록형 PlaceCard는 마법사·홈·찜 목록이 그대로 쓴다.
// 사진은 장소 데이터의 imageUrl만 쓰고(라이선스를 모르는 사진은 넣지 않는다), 없거나 못 불러오면 카테고리 아이콘 칸을 그린다.
// rank(1~)는 추천 순서를 「1위」 배지로 보여 줄 때만 넘긴다. 버튼 안에 버튼을 넣을 수 없어서 찜 버튼은 사진 위에 겹쳐 놓는다.
export default function PlacePhotoCard({ place, onSelect, distance = null, rank = null }) {
  const { t } = useTranslation();
  const [failedImage, setFailedImage] = useState(null);
  const hasImage = Boolean(place.imageUrl && place.imageUrl !== failedImage);
  const categoryLabel = t(`common.category.${place.category}`);
  const distanceText = distance === null ? null : formatDistance(distance);

  return (
    <li className="relative min-w-0">
      <button
        type="button"
        onClick={() => onSelect(place)}
        className="group block w-full rounded-2xl text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <span className="relative block aspect-4/3 overflow-hidden rounded-2xl bg-bg-soft">
          {hasImage ? (
            <img
              src={place.imageUrl}
              onError={() => setFailedImage(place.imageUrl)}
              alt=""
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span
              aria-hidden="true"
              className={`grid size-full place-items-center transition-transform duration-500 group-hover:scale-105 ${CATEGORY_TONE_CLASSES[place.category] ?? DEFAULT_TONE_CLASS}`}
            >
              <CategoryIcon category={place.category} size={44} />
            </span>
          )}
          {/* point 위 글자는 흰색 규칙(primary 위 16px 굵게)에 안 맞아서 테마와 상관없이 진한 ink를 쓴다. */}
          {rank ? (
            <span className="absolute top-2.5 left-2.5 rounded-full bg-point px-2.5 py-0.5 text-caption font-bold text-ink">
              {t('places.card.rank', { rank })}
            </span>
          ) : null}
        </span>
        <span className="mt-3 block px-1">
          <span className="flex items-center gap-1.5 text-caption text-text/70">
            <span className="font-bold text-link">{categoryLabel}</span>
            {place.rating !== null ? (
              <span className="text-point">
                <span aria-hidden="true">★ {place.rating}</span>
                <span className="sr-only">{t('search.card.rating', { rating: place.rating })}</span>
              </span>
            ) : null}
            {distanceText ? (
              <span className="font-bold">
                {t(`restaurant.distance.${distanceText.unit}`, { value: distanceText.value })}
              </span>
            ) : null}
          </span>
          <span className="mt-1 block truncate text-body font-bold sm:text-subtitle">
            {place.name}
          </span>
          <span className="mt-0.5 block truncate text-body-sm text-text/60">{place.address}</span>
        </span>
      </button>
      <FavoriteButton
        place={place}
        className="absolute top-1.5 right-1.5 bg-background/90 hover:bg-background"
      />
    </li>
  );
}
