import { useTranslation } from 'react-i18next';
import FlipCardFrame from '../../../components/common/FlipCardFrame';
import { useAdminStore } from '../../admin/hooks/useAdminStore';
import { formatPrice } from '../utils/formatPrice';
import ProductCategoryIcon from './ProductCategoryIcon';

// 사진이 없는 상품은 종류마다 다른 옅은 바탕 + 아이콘으로 대신 그린다. 목업 상품은 모두 사진이 없어서
// 같은 색만 이어지면 구분이 안 되기 때문이다. 바탕은 투명도를 낮춰서 다크모드에서도 어둡게 깔린다.
const FALLBACK_CLASS = {
  tour: 'bg-brand/15 text-primary',
  ticket: 'bg-apricot-soft text-apricot-ink',
  pass: 'bg-primary/10 text-link',
  activity: 'bg-day-2/15 text-day-2',
  snap: 'bg-day-3/15 text-day-3',
};

// 상품 카드 — 목록(63)과 홈 섹션(62)·장소 상세에서 같이 쓴다. 누르면 뒤집혀 뒷면에 소개·소요 시간과
// [상품 자세히 보기]가 나온다 (상세로 가는 건 뒷면 버튼).
// rank를 넘기면 사진 왼쪽 위에 「1위」 같은 순위 배지를 단다 (목록의 평점 상위).
// 관리자가 추천 고정한 상품(85)은 순위 대신 「추천」 배지를 단다 — 맨 앞에 와서 순위와 섞이면 헷갈린다.
// draggable={false}: 가로로 넘기는 목록(홈·장소 상세)에서는 끌어서 뒤집기가 목록 스크롤과 부딪혀서 끈다.
// sizeClass: 카드 높이(비율). 좁은 2열 그리드는 글자 자리가 모자라서 더 길쭉하게 쓴다.
export default function ProductCard({
  product,
  onSelect,
  rank = null,
  draggable = true,
  sizeClass = 'aspect-3/4',
}) {
  const { t } = useTranslation();
  const isPinned = useAdminStore((state) => state.pinnedProductIds.includes(product.id));
  const categoryLabel = t(`product.category.${product.category}`);
  const reviewCount = product.reviewCount.toLocaleString('ko-KR');
  const price = t(`product.price.${product.currency}`, { value: formatPrice(product.price) });
  const rating = (
    <span className="text-caption text-text/70">
      <span aria-hidden="true">
        <span className="text-gold">★</span> {product.rating} ({reviewCount})
      </span>
      <span className="sr-only">
        {t('product.card.rating', { rating: product.rating, count: reviewCount })}
      </span>
    </span>
  );

  const front = (
    <span className="flex size-full flex-col">
      <span className="relative block min-h-0 flex-1 overflow-hidden bg-bg-soft">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt="" loading="lazy" className="size-full object-cover" />
        ) : (
          <span
            aria-hidden="true"
            className={`flex size-full flex-col items-center justify-center gap-2 ${FALLBACK_CLASS[product.category] ?? 'text-primary'}`}
          >
            <ProductCategoryIcon category={product.category} size={40} />
            <span className="text-body-sm font-bold text-text/70">{categoryLabel}</span>
          </span>
        )}
        {isPinned || rank ? (
          <span className="absolute top-3 left-3 rounded-full bg-apricot px-2.5 py-1 text-caption font-bold text-ink">
            {isPinned ? t('product.card.pinned') : t('product.card.rank', { rank })}
          </span>
        ) : null}
      </span>
      <span className="flex flex-col gap-1 px-3 pt-2.5 pb-3">
        <span className="truncate text-caption text-text/60">
          {t(`common.city.${product.city}`)} · {categoryLabel}
        </span>
        <span className="line-clamp-2 text-body font-bold break-keep">{product.title}</span>
        <span className="flex flex-wrap items-baseline justify-between gap-x-2">
          <span className="text-body font-bold">{price}</span>
          {rating}
        </span>
      </span>
    </span>
  );

  const back = (
    <span className="flex size-full flex-col gap-2 bg-bg-soft p-3 sm:p-4">
      <span className="text-caption text-text/60">
        {t(`common.city.${product.city}`)} · {categoryLabel}
      </span>
      <span className="line-clamp-2 text-body font-bold break-keep">{product.title}</span>
      <span className="line-clamp-4 text-body-sm text-text/70 break-keep">
        {product.description ?? product.summary}
      </span>
      <span className="flex flex-wrap items-center gap-x-2 text-caption text-text/70">
        {product.duration ? (
          <span>{t('product.card.duration', { duration: product.duration })}</span>
        ) : null}
        {rating}
      </span>
      <span className="text-body font-bold">{price}</span>
      <button
        type="button"
        onClick={() => onSelect(product)}
        className="mt-auto rounded-xl bg-primary px-3 py-2.5 text-body font-bold text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {t('product.card.detail')}
      </button>
    </span>
  );

  return (
    <FlipCardFrame
      front={front}
      back={back}
      ariaLabel={t('common.flipCard.label', { name: product.title })}
      draggable={draggable}
      className={sizeClass}
    />
  );
}
