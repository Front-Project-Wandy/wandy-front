import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import { usePlace } from '../../search/hooks/usePlace';
import { PLACE_RATINGS, usePlaceRatingStore } from '../hooks/usePlaceRatingStore';

// 다녀온 장소 한 줄 (97). 구글 장소는 이름을 저장하지 않아서(약관) placeId로 다시 불러온다.
// 같은 평가를 다시 누르면 평가가 지워진다 (usePlaceRatingStore.rate).
export default function PlaceRatingRow({ item }) {
  const { t } = useTranslation();
  const { data: place, isError } = usePlace(item.name ? null : item.placeId);
  const rating = usePlaceRatingStore((state) => state.ratings[item.placeId]);
  const rate = usePlaceRatingStore((state) => state.rate);
  const name =
    item.name ??
    place?.name ??
    t(isError ? 'my.ratings.unknownPlace' : 'wizard.spots.basket.loadingName');

  return (
    <li className="flex flex-col gap-2 rounded-xl border border-text/10 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate text-body font-bold">{name}</p>
        {item.myCategory ? (
          <p className="text-body-sm text-text/70">{t(`common.category.${item.myCategory}`)}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 gap-2">
        {PLACE_RATINGS.map((value) => (
          <Button
            key={value}
            size="sm"
            variant={rating === value ? 'primary' : 'secondary'}
            aria-pressed={rating === value}
            aria-label={t(`my.ratings.${value}Label`, { name })}
            onClick={() => rate(item.placeId, value)}
          >
            {t(`my.ratings.${value}`)}
          </Button>
        ))}
      </div>
    </li>
  );
}
