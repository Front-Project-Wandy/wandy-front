import { useTranslation } from 'react-i18next';
import { formatPrice } from '../utils/formatPrice';
import ProductCategoryIcon from './ProductCategoryIcon';

// 사진이 없는 상품은 종류마다 다른 옅은 바탕 + 아이콘으로 대신 그린다. 목업 상품은 모두 사진이 없어서
// 같은 색만 이어지면 구분이 안 되기 때문이다. 바탕은 투명도를 낮춰서 다크모드에서도 어둡게 깔린다.
const FALLBACK_CLASS = {
  tour: 'bg-brand/15 text-primary',
  ticket: 'bg-point/15 text-point',
  pass: 'bg-primary/10 text-link',
  activity: 'bg-day-2/15 text-day-2',
  snap: 'bg-day-3/15 text-day-3',
};

// 상품 카드 — 목록(63)과 홈 섹션(62)·장소 상세에서 같이 쓴다. 테두리 상자 대신 둥근 사진 위에 글자를 둔다.
// rank를 넘기면 사진 왼쪽 위에 「1위」 같은 순위 배지를 단다 (목록의 평점 상위).
export default function ProductCard({ product, onSelect, rank = null }) {
  const { t } = useTranslation();
  const categoryLabel = t(`product.category.${product.category}`);
  const reviewCount = product.reviewCount.toLocaleString('ko-KR');

  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="group flex h-full w-full flex-col rounded-2xl text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <span className="relative block aspect-4/3 w-full overflow-hidden rounded-2xl bg-bg-soft">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt=""
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <span
            aria-hidden="true"
            className={`flex size-full flex-col items-center justify-center gap-2 transition-transform duration-500 group-hover:scale-105 ${FALLBACK_CLASS[product.category] ?? 'text-primary'}`}
          >
            <ProductCategoryIcon category={product.category} size={40} />
            <span className="text-body-sm font-bold text-text/70">{categoryLabel}</span>
          </span>
        )}
        {rank ? (
          <span className="absolute top-3 left-3 rounded-full bg-background px-2.5 py-1 text-caption font-bold text-link">
            {t('product.card.rank', { rank })}
          </span>
        ) : null}
      </span>
      <span className="flex flex-1 flex-col gap-1 px-1 pt-3">
        <span className="text-caption text-text/60">
          {t(`common.city.${product.city}`)} · {categoryLabel}
        </span>
        <span className="line-clamp-2 text-body font-bold break-keep">{product.title}</span>
        <span className="line-clamp-1 text-body-sm text-text/70">{product.summary}</span>
        <span className="mt-auto flex flex-wrap items-baseline justify-between gap-x-2 pt-2">
          <span className="text-body font-bold">
            {t(`product.price.${product.currency}`, { value: formatPrice(product.price) })}
          </span>
          <span className="text-caption text-text/70">
            <span aria-hidden="true">
              <span className="text-point">★</span> {product.rating} ({reviewCount})
            </span>
            <span className="sr-only">
              {t('product.card.rating', { rating: product.rating, count: reviewCount })}
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}
