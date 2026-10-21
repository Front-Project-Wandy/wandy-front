import { useTranslation } from 'react-i18next';
import { formatPrice } from '../utils/formatPrice';

// 상품 카드 — 목록(63)과 홈 섹션(62)에서 같이 쓴다. 사진이 없으면 종류 이름 칸을 대신 보여준다.
export default function ProductCard({ product, onSelect }) {
  const { t } = useTranslation();
  const categoryLabel = t(`product.category.${product.category}`);

  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-text/10 bg-background text-left transition-colors hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-primary"
    >
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt=""
          className="aspect-video w-full object-cover"
          loading="lazy"
        />
      ) : (
        <span
          aria-hidden="true"
          className="grid aspect-video w-full place-items-center bg-bg-soft text-subtitle font-bold text-link"
        >
          {categoryLabel}
        </span>
      )}
      <span className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-caption font-bold text-link">
          {t(`common.city.${product.city}`)} · {categoryLabel}
        </span>
        <span className="line-clamp-2 text-body font-bold">{product.title}</span>
        <span className="line-clamp-1 text-body-sm text-text/70">{product.summary}</span>
        <span className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-body font-bold">
            {t(`product.price.${product.currency}`, { value: formatPrice(product.price) })}
          </span>
          <span className="text-caption text-point">
            <span aria-hidden="true">
              ★ {product.rating} ({product.reviewCount.toLocaleString('ko-KR')})
            </span>
            <span className="sr-only">
              {t('product.card.rating', {
                rating: product.rating,
                count: product.reviewCount.toLocaleString('ko-KR'),
              })}
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}
