import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FlipCardFrame from '../../../components/common/FlipCardFrame';
import FavoriteButton from '../../member/components/FavoriteButton';
import { formatDistance } from '../../restaurant/utils/formatDistance';
import { CATEGORY_TONE_CLASSES, DEFAULT_TONE_CLASS } from '../utils/categoryTone';
import CategoryIcon from './CategoryIcon';

// 구글 영업시간(weekdayDescriptions)은 월요일부터 7줄이라, 오늘 요일 줄을 고른다.
const getTodayHours = (openingHours) =>
  Array.isArray(openingHours) ? (openingHours[(new Date().getDay() + 6) % 7] ?? null) : null;

// 장소 탐색(/places) 그리드용 뒤집히는 사진 카드. 목록형 PlaceCard는 마법사·홈·찜 목록이 그대로 쓴다.
// 앞면은 사진·이름, 누르면 뒷면에 주소·평점·오늘 영업시간과 [장소 상세 보기]가 나온다.
// 사진은 장소 데이터의 imageUrl만 쓰고(라이선스를 모르는 사진은 넣지 않는다), 없거나 못 불러오면 카테고리 아이콘 칸을 그린다.
// rank(1~)는 추천 순서를 「1위」 배지로 보여 줄 때만 넘긴다.
export default function PlacePhotoCard({ place, onSelect, distance = null, rank = null }) {
  const { t } = useTranslation();
  const [failedImage, setFailedImage] = useState(null);
  const hasImage = Boolean(place.imageUrl && place.imageUrl !== failedImage);
  const categoryLabel = t(`common.category.${place.category}`);
  const distanceText = distance === null ? null : formatDistance(distance);
  const todayHours = getTodayHours(place.openingHours);

  const meta = (
    <span className="flex flex-wrap items-center gap-x-1.5 text-caption text-text/70">
      <span className="font-bold text-link">{categoryLabel}</span>
      {place.rating !== null ? (
        <span className="text-gold-ink">
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
  );

  const front = (
    <span className="flex size-full flex-col">
      <span className="relative block min-h-0 flex-1 overflow-hidden bg-bg-soft">
        {hasImage ? (
          <img
            src={place.imageUrl}
            onError={() => setFailedImage(place.imageUrl)}
            alt=""
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className={`grid size-full place-items-center ${CATEGORY_TONE_CLASSES[place.category] ?? DEFAULT_TONE_CLASS}`}
          >
            <CategoryIcon category={place.category} size={44} />
          </span>
        )}
        {/* point 위 글자는 흰색 규칙(primary 위 16px 굵게)에 안 맞아서 테마와 상관없이 진한 ink를 쓴다. */}
        {rank ? (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-apricot px-2.5 py-0.5 text-caption font-bold text-ink">
            {t('places.card.rank', { rank })}
          </span>
        ) : null}
        <FavoriteButton
          place={place}
          className="absolute top-1.5 right-1.5 bg-background/90 hover:bg-background"
        />
      </span>
      <span className="block px-3 pt-2.5 pb-3">
        {meta}
        <span className="mt-1 block truncate text-body font-bold sm:text-subtitle">
          {place.name}
        </span>
        <span className="mt-0.5 block truncate text-caption text-text/50">
          {t('common.flipCard.hint')}
        </span>
      </span>
    </span>
  );

  const back = (
    <span className="flex size-full flex-col gap-2 bg-bg-soft p-3 sm:p-4">
      {meta}
      <span className="line-clamp-2 text-body font-bold break-keep sm:text-subtitle">
        {place.name}
      </span>
      <span className="line-clamp-3 text-body-sm text-text/70">{place.address}</span>
      {todayHours ? (
        <span className="line-clamp-2 text-caption text-text/70">
          <span className="font-bold">{t('places.card.hours')}</span> {todayHours}
        </span>
      ) : null}
      <button
        type="button"
        onClick={() => onSelect(place)}
        className="mt-auto rounded-xl bg-primary px-3 py-2.5 text-body font-bold text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {t('places.card.detail')}
      </button>
    </span>
  );

  return (
    <li className="min-w-0">
      <FlipCardFrame
        front={front}
        back={back}
        ariaLabel={t('common.flipCard.label', { name: place.name })}
        className="aspect-3/4"
      />
    </li>
  );
}
