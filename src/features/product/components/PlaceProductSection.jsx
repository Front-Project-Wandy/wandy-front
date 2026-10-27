import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import ErrorState from '../../../components/common/ErrorState';
import Loading from '../../../components/common/Loading';
import { useProducts } from '../hooks/useProducts';
import { pickPlaceProducts } from '../utils/pickPlaceProducts';
import ProductCard from './ProductCard';

// 장소 상세의 「이 장소와 어울리는 투어」 (84). 같은 도시 상품만 받아서 pickPlaceProducts로 고른다.
// 같은 도시에 상품이 하나도 없으면 빈 안내 대신 섹션을 숨긴다 — 장소 상세의 본론이 아니라서.
export default function PlaceProductSection({ place, className = '' }) {
  const { t } = useTranslation();
  const titleId = useId();
  const navigate = useNavigate();
  const { data, isPending, isError, refetch } = useProducts({
    country: place.country,
    city: place.city,
  });
  const items = pickPlaceProducts(place, data ?? []);

  if (!isPending && !isError && items.length === 0) return null;

  const renderItems = () => {
    if (isPending) return <Loading />;
    if (isError) return <ErrorState onRetry={() => refetch()} />;
    return (
      <ul className="flex snap-x gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
        {items.map((product) => (
          <li key={product.id} className="w-64 shrink-0 snap-start lg:w-auto">
            <ProductCard
              product={product}
              onSelect={(item) => navigate(`/products?id=${encodeURIComponent(item.id)}`)}
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    // 가로로 넘기는 목록이 그리드 칸을 밀어 넓히지 않도록 min-w-0을 둔다.
    <section aria-labelledby={titleId} className={`min-w-0 space-y-3 ${className}`}>
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <h2 id={titleId} className="text-subtitle font-bold">
            {t('product.placeSection.title')}
          </h2>
          <p className="text-body-sm text-text/70">
            {t('product.placeSection.subtitle', { city: t(`common.city.${place.city}`) })}
          </p>
        </div>
        <Link
          to={`/products?country=${place.country}`}
          className="shrink-0 text-body-sm font-bold text-link"
        >
          {t('product.section.more')}
        </Link>
      </div>
      {renderItems()}
    </section>
  );
}
