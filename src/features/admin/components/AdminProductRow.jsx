import { useTranslation } from 'react-i18next';
import Chip from '../../../components/common/Chip';
import { formatPrice } from '../../product/utils/formatPrice';
import { ROW_COLUMN_CLASS } from '../constants';

// 관리 화면 상품 한 줄. 모바일은 카드, lg부터 표의 한 줄로 보인다.
export default function AdminProductRow({
  product,
  hidden,
  pinned,
  onToggleHidden,
  onTogglePinned,
}) {
  const { t } = useTranslation();
  const price = t(`product.price.${product.currency}`, { value: formatPrice(product.price) });

  return (
    <li
      className={`flex flex-col gap-3 rounded-2xl border border-text/10 bg-background p-4 lg:flex-row lg:items-center lg:gap-4 lg:rounded-none lg:border-0 lg:px-4 lg:py-3 ${hidden ? 'opacity-60' : ''}`}
    >
      <p className="min-w-0 font-bold break-keep lg:flex-1">{product.title}</p>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-body-sm text-text/70 lg:contents">
        <span className={`lg:shrink-0 ${ROW_COLUMN_CLASS.city}`}>
          {t(`common.city.${product.city}`)}
        </span>
        <span className={`lg:shrink-0 ${ROW_COLUMN_CLASS.category}`}>
          {t(`product.category.${product.category}`)}
        </span>
        <span className={`lg:shrink-0 lg:text-right ${ROW_COLUMN_CLASS.price}`}>{price}</span>
        <span className={`lg:shrink-0 lg:text-right ${ROW_COLUMN_CLASS.rating}`}>
          <span aria-hidden="true" className="text-gold">
            ★{' '}
          </span>
          {product.rating}
        </span>
      </div>
      <div className={`flex gap-2 lg:shrink-0 lg:justify-end ${ROW_COLUMN_CLASS.actions}`}>
        <Chip
          label={t('admin.product.hide')}
          selected={hidden}
          onClick={() => onToggleHidden(product.id)}
          aria-label={t('admin.product.hideLabel', { title: product.title })}
        />
        <Chip
          label={t('admin.product.pin')}
          selected={pinned}
          onClick={() => onTogglePinned(product.id)}
          aria-label={t('admin.product.pinLabel', { title: product.title })}
        />
      </div>
    </li>
  );
}
