import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { usePlanStore } from '../../../store/plan/usePlanStore';
import { useProducts } from '../hooks/useProducts';
import { formatPrice } from '../utils/formatPrice';
import { pickDayProducts } from '../utils/pickDayProducts';
import {
  buildProductItemOptions,
  hasProductInItems,
  toProductPlace,
} from '../utils/productPlanItem';

// 플래너 DAY 아래 「이 날과 어울리는 투어」 (84). 그날 담은 장소와 어울리는 상품을 최대 2개 보여 준다.
// 일정 화면의 보조 정보라 불러오는 중·실패·어울리는 상품 없음일 때는 아무것도 그리지 않는다
// (DAY마다 로딩·에러 칸이 생기면 일정이 어수선해진다. 상품 목록 화면에는 상태가 다 있다).
// [이 날에 넣기]는 플래너가 연 여행(지금 여는 여행)의 이 DAY 끝에 넣는다. addItem이라 되돌리기로 뺄 수 있다.
// <DayProductSuggestions country={trip.country} city={trip.city} items={day.items} dayIndex={dayIndex} />
export default function DayProductSuggestions({ country, city, items, dayIndex }) {
  const { t } = useTranslation();
  const titleId = useId();
  const addItem = usePlanStore((state) => state.addItem);
  const { data } = useProducts({ country, city });
  const products = pickDayProducts(
    { country, city, categories: items.map((item) => item.myCategory) },
    data ?? [],
  );
  if (products.length === 0) return null;

  const handleAdd = (product) =>
    addItem(dayIndex, toProductPlace(product), buildProductItemOptions(product, items));

  return (
    <section aria-labelledby={titleId} className="space-y-2 rounded-2xl bg-bg-soft p-3">
      <h3 id={titleId} className="text-body-sm font-bold">
        {t('product.daySection.title')}
      </h3>
      <ul className="space-y-1">
        {products.map((product) => {
          // 넣은 뒤에도 목록에 남겨 두고 버튼만 「넣었어요」로 바꾼다 (되돌리면 다시 버튼이 된다)
          const isAdded = hasProductInItems(items, product.id);
          return (
            <li key={product.id} className="flex items-center gap-1">
              <Link
                to={`/products?id=${encodeURIComponent(product.id)}`}
                className="flex min-w-0 flex-1 items-center justify-between gap-3 rounded-xl px-1 py-2 text-body-sm focus-visible:outline-2 focus-visible:outline-primary"
              >
                <span className="min-w-0 truncate font-bold text-link">{product.title}</span>
                <span className="shrink-0 text-text/70">
                  {t(`product.price.${product.currency}`, { value: formatPrice(product.price) })}
                </span>
              </Link>
              <button
                type="button"
                disabled={isAdded}
                aria-label={
                  isAdded
                    ? undefined
                    : t('product.daySection.addLabel', {
                        name: product.title,
                        number: dayIndex + 1,
                      })
                }
                onClick={() => handleAdd(product)}
                className="h-9 shrink-0 rounded-xl px-2 text-body-sm font-bold text-link transition-colors enabled:hover:bg-background focus-visible:outline-2 focus-visible:outline-primary disabled:text-text/60"
              >
                {isAdded ? t('product.daySection.added') : t('product.daySection.add')}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
