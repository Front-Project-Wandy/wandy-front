import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FavoriteButton from '../../member/components/FavoriteButton';
import { formatDistance } from '../../restaurant/utils/formatDistance';

// 검색·추천 결과 카드. 사진이 없으면(구글 사진은 1단계에서 비움) 카테고리 이름 칸을 대신 보여준다.
// 버튼 안에 버튼을 넣을 수 없어서, 찜 버튼은 카드 버튼 옆에 두고 오른쪽 위에 겹쳐 놓는다.
// distance(m)는 가까운 순으로 볼 때만 넘어온다 (43).
export default function PlaceCard({ place, onSelect, distance = null, imageUrl = place.imageUrl }) {
  const { t } = useTranslation();
  const [failedImage, setFailedImage] = useState(null);
  const hasImage = Boolean(imageUrl && imageUrl !== failedImage);
  const categoryLabel = t(`common.category.${place.category}`);
  const distanceText = distance === null ? null : formatDistance(distance);
  const distanceLabel = distanceText
    ? t(`restaurant.distance.${distanceText.unit}`, { value: distanceText.value })
    : null;

  return (
    <li className="relative">
      <button
        type="button"
        onClick={() => onSelect(place)}
        className="relative flex w-full items-center gap-3 rounded-2xl border border-text/10 bg-background p-3 pr-14 text-left transition-colors hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-primary"
      >
        {hasImage ? (
          <img
            src={imageUrl}
            onError={() => setFailedImage(imageUrl)}
            alt=""
            className="size-20 shrink-0 rounded-xl object-cover"
            loading="lazy"
          />
        ) : (
          <span
            aria-hidden="true"
            className="grid size-16 shrink-0 place-items-center rounded-xl bg-bg-soft text-body-sm font-bold text-link"
          >
            {categoryLabel}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-body font-bold">{place.name}</span>
          <span className="block truncate text-body-sm text-text/70">{place.address}</span>
          {/* 사진이 없으면 왼쪽 칸이 카테고리를 보여주므로 칩은 화면에서만 숨긴다.
              왼쪽 칸은 장식으로 숨기고 여기서 읽게 해야 화면 읽기에서 이름 → 주소 → 카테고리 순서가 된다. */}
          {hasImage || place.rating !== null || distanceLabel ? (
            <span className="mt-1 flex flex-wrap items-center gap-2 text-caption">
              <span className={hasImage ? 'rounded-full bg-bg-soft px-2 py-0.5' : 'sr-only'}>
                {categoryLabel}
              </span>
              {place.rating !== null ? (
                <span className="text-gold-ink">
                  <span aria-hidden="true">★ {place.rating}</span>
                  <span className="sr-only">
                    {t('search.card.rating', { rating: place.rating })}
                  </span>
                </span>
              ) : null}
              {distanceLabel ? <span className="font-bold text-link">{distanceLabel}</span> : null}
            </span>
          ) : (
            <span className="sr-only">{categoryLabel}</span>
          )}
        </span>
      </button>
      <FavoriteButton place={place} className="absolute top-1.5 right-1.5" />
    </li>
  );
}
