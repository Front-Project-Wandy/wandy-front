import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import EmptyState from '../../../components/common/EmptyState';
import ErrorState from '../../../components/common/ErrorState';
import Loading from '../../../components/common/Loading';
import { PRODUCT_SECTION_LIMIT } from '../constants';
import { useProducts } from '../hooks/useProducts';
import ProductCard from './ProductCard';
import ProductCategoryChips from './ProductCategoryChips';

// 홈 하단 투어 상품 섹션 (62). A파트가 홈(H01)에 <ProductSection />으로 놓기만 하면 된다.
// country·city를 넘기면 그 여행지 상품만 보여준다.
export default function ProductSection({ country = null, city = null }) {
  const { t } = useTranslation();
  const titleId = useId();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const { data, isPending, isError, refetch } = useProducts({ country, city, category });
  const items = (data ?? []).slice(0, PRODUCT_SECTION_LIMIT);

  const listParams = new URLSearchParams();
  if (country) listParams.set('country', country);
  if (category) listParams.set('category', category);
  const listPath = `/products${listParams.size ? `?${listParams}` : ''}`;

  const renderItems = () => {
    if (isPending) return <Loading />;
    if (isError) return <ErrorState onRetry={() => refetch()} />;
    // 이 섹션에는 개수 안내가 없어서, 종류를 바꿔 목록이 비면 화면 낭독기가 알 수 있게 status로 감싼다.
    if (items.length === 0)
      return (
        <div role="status">
          <EmptyState title={t('product.empty.title')} />
        </div>
      );
    return (
      <ul className="relative flex snap-x gap-3 overflow-x-auto pb-2">
        {items.map((product) => (
          <li key={product.id} className="w-64 shrink-0 snap-start">
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
    <section aria-labelledby={titleId} className="space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id={titleId} className="text-subtitle font-bold">
          {t('product.section.title')}
        </h2>
        <Link to={listPath} className="shrink-0 text-body-sm font-bold text-link">
          {t('product.section.more')}
        </Link>
      </div>
      <ProductCategoryChips value={category} onChange={setCategory} />
      {renderItems()}
    </section>
  );
}
