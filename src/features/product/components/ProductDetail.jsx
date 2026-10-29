import { useTranslation } from 'react-i18next';
import EmptyState from '../../../components/common/EmptyState';
import ErrorState from '../../../components/common/ErrorState';
import Loading from '../../../components/common/Loading';
import { useProduct } from '../hooks/useProducts';
import { formatPrice } from '../utils/formatPrice';
import ProductPhotoCredit from './ProductPhotoCredit';

// 상품 상세 + 외부 예약 링크 (64). 예약·결제는 우리 서비스에서 하지 않는다.
export default function ProductDetail({ id }) {
  const { t } = useTranslation();
  const { data: product, isPending, isError, error, refetch } = useProduct(id);

  if (isPending) return <Loading />;
  if (isError && error.message === 'PRODUCT_NOT_FOUND')
    return <EmptyState title={t('product.error.notFound')} />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const categoryLabel = t(`product.category.${product.category}`);

  return (
    <article className="grid gap-6 lg:grid-cols-2">
      {product.imageUrl ? (
        <figure className="space-y-2">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="aspect-[4/3] w-full rounded-2xl object-cover"
          />
          {product.photoCredit ? <ProductPhotoCredit credit={product.photoCredit} /> : null}
        </figure>
      ) : (
        <div
          aria-hidden="true"
          className="grid aspect-[4/3] w-full place-items-center rounded-2xl bg-bg-soft text-title font-bold text-link"
        >
          {categoryLabel}
        </div>
      )}

      <div className="space-y-4">
        <header className="space-y-2">
          <p className="text-body-sm font-bold text-link">
            {t(`common.city.${product.city}`)} · {categoryLabel}
          </p>
          <h1 className="text-title font-bold">{product.title}</h1>
          <p className="text-body-sm text-gold-ink">
            <span aria-hidden="true">
              ★ {product.rating} ({product.reviewCount.toLocaleString('ko-KR')})
            </span>
            <span className="sr-only">
              {t('product.card.rating', {
                rating: product.rating,
                count: product.reviewCount.toLocaleString('ko-KR'),
              })}
            </span>
          </p>
          <p className="text-subtitle font-bold">
            {t(`product.price.${product.currency}`, { value: formatPrice(product.price) })}
          </p>
        </header>

        <p className="text-body">{product.description}</p>

        <dl className="rounded-2xl border border-text/10 p-4">
          <dt className="text-caption font-bold text-text/70">{t('product.detail.duration')}</dt>
          <dd className="text-body">{product.duration}</dd>
        </dl>

        <ul className="flex flex-wrap gap-2" aria-label={t('product.detail.tags')}>
          {product.tags.map((tag) => (
            <li key={tag} className="rounded-full bg-bg-soft px-3 py-1 text-body-sm">
              {tag}
            </li>
          ))}
        </ul>

        <div className="space-y-2">
          <a
            href={product.bookingUrl}
            target="_blank"
            rel="noreferrer"
            className="flex h-12 w-full items-center justify-center rounded-xl bg-primary px-5 text-body font-bold text-white"
          >
            {t('product.detail.book')}
          </a>
          <p className="text-center text-caption text-text/70">{t('product.detail.notice')}</p>
        </div>
      </div>
    </article>
  );
}
