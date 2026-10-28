import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { formatPrice } from '../utils/formatPrice';
import { pickDayProducts } from '../utils/pickDayProducts';

// 플래너 DAY 아래 「이 날과 어울리는 투어」 (84). 그날 담은 장소와 어울리는 상품을 최대 2개 보여 준다.
// 일정 화면의 보조 정보라 불러오는 중·실패·어울리는 상품 없음일 때는 아무것도 그리지 않는다
// (DAY마다 로딩·에러 칸이 생기면 일정이 어수선해진다. 상품 목록 화면에는 상태가 다 있다).
// <DayProductSuggestions country={trip.country} city={trip.city} items={day.items} />
export default function DayProductSuggestions({ country, city, items }) {
  const { t } = useTranslation();
  const titleId = useId();
  const { data } = useProducts({ country, city });
  const products = pickDayProducts(
    { country, city, categories: items.map((item) => item.myCategory) },
    data ?? [],
  );
  if (products.length === 0) return null;

  return (
    <section aria-labelledby={titleId} className="space-y-2 rounded-2xl bg-bg-soft p-3">
      <h3 id={titleId} className="text-body-sm font-bold">
        {t('product.daySection.title')}
      </h3>
      <ul className="space-y-1">
        {products.map((product) => (
          <li key={product.id}>
            <Link
              to={`/products?id=${encodeURIComponent(product.id)}`}
              className="flex items-center justify-between gap-3 rounded-xl px-1 py-2 text-body-sm focus-visible:outline-2 focus-visible:outline-primary"
            >
              <span className="min-w-0 truncate font-bold text-link">{product.title}</span>
              <span className="shrink-0 text-text/70">
                {t(`product.price.${product.currency}`, { value: formatPrice(product.price) })}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
