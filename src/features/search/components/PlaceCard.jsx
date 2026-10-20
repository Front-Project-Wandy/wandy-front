import { useTranslation } from 'react-i18next';

// 검색·추천 결과 카드. 사진이 없으면(구글 사진은 1단계에서 비움) 카테고리 이름 칸을 대신 보여준다.
export default function PlaceCard({ place, onSelect }) {
  const { t } = useTranslation();
  const categoryLabel = t(`common.category.${place.category}`);

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(place)}
        className="flex w-full items-center gap-3 rounded-2xl border border-text/10 bg-background p-3 text-left transition-colors hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-primary"
      >
        {place.imageUrl ? (
          <img
            src={place.imageUrl}
            alt=""
            className="size-16 shrink-0 rounded-xl object-cover"
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
          {/* 사진이 있을 때만 카테고리 칩을 따로 보여준다 (없으면 왼쪽 칸이 카테고리) */}
          {place.imageUrl || place.rating !== null ? (
            <span className="mt-1 flex items-center gap-2 text-caption">
              {place.imageUrl ? (
                <span className="rounded-full bg-bg-soft px-2 py-0.5">{categoryLabel}</span>
              ) : null}
              {place.rating !== null ? (
                <span className="text-point">
                  <span aria-hidden="true">★ {place.rating}</span>
                  <span className="sr-only">
                    {t('search.card.rating', { rating: place.rating })}
                  </span>
                </span>
              ) : null}
            </span>
          ) : null}
        </span>
      </button>
    </li>
  );
}
