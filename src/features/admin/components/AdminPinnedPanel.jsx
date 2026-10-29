import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';

// 「추천 고정 순서」. 사용자 목록·홈 상품 줄 맨 앞에 이 순서대로 나온다.
// 끌어서 옮기기 대신 위·아래 버튼만 둔다 — 고정 상품은 몇 개뿐이고, 키보드로도 바로 쓸 수 있다.
export default function AdminPinnedPanel({ pinnedIds, products, onMove, onUnpin }) {
  const { t } = useTranslation();
  const pinned = pinnedIds
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);

  return (
    <section aria-labelledby="admin-pinned-title" className="rounded-2xl bg-bg-soft p-4 sm:p-6">
      <h2 id="admin-pinned-title" className="text-subtitle font-bold">
        {t('admin.pinned.title')}
      </h2>
      <p className="mt-1 text-body-sm text-text/70 break-keep">{t('admin.pinned.description')}</p>
      {pinned.length === 0 ? (
        <p className="mt-4 text-body-sm text-text/70">{t('admin.pinned.empty')}</p>
      ) : (
        <ol className="mt-4 flex flex-col gap-2">
          {pinned.map((product, index) => (
            <li
              key={product.id}
              className="flex items-center gap-2 rounded-xl bg-background py-1 pr-1 pl-3"
            >
              <span className="w-6 shrink-0 text-body-sm font-bold text-link">{index + 1}</span>
              <span className="min-w-0 flex-1 text-body-sm font-bold break-keep">
                {product.title}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={index === 0}
                onClick={() => onMove(product.id, 'up')}
                aria-label={t('admin.pinned.up', { title: product.title })}
              >
                <span aria-hidden="true">↑</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={index === pinned.length - 1}
                onClick={() => onMove(product.id, 'down')}
                aria-label={t('admin.pinned.down', { title: product.title })}
              >
                <span aria-hidden="true">↓</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUnpin(product.id)}
                aria-label={t('admin.pinned.remove', { title: product.title })}
              >
                <span aria-hidden="true">✕</span>
              </Button>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
