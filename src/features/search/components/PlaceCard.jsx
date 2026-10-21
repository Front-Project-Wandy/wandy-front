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
        className="relative flex w-full items-center gap-3 rounded-2xl border border-text/10 bg-background p-3 text-left transition-colors hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-primary"
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
          {/* 사진이 없으면 왼쪽 칸이 카테고리를 보여주므로 칩은 화면에서만 숨긴다.
              왼쪽 칸은 장식으로 숨기고 여기서 읽게 해야 화면 읽기에서 이름 → 주소 → 카테고리 순서가 된다. */}
          {place.imageUrl || place.rating !== null ? (
            <span className="mt-1 flex items-center gap-2 text-caption">
              <span className={place.imageUrl ? 'rounded-full bg-bg-soft px-2 py-0.5' : 'sr-only'}>
                {categoryLabel}
              </span>
              {place.rating !== null ? (
                <span className="text-point">
                  <span aria-hidden="true">★ {place.rating}</span>
                  <span className="sr-only">
                    {t('search.card.rating', { rating: place.rating })}
                  </span>
                </span>
              ) : null}
            </span>
          ) : (
            <span className="sr-only">{categoryLabel}</span>
          )}
        </span>
      </button>
    </li>
  );
}
