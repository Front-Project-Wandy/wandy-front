import { useTranslation } from 'react-i18next';
import { usePlace } from '../../search/hooks/usePlace';

// 장소 이름. 구글 장소는 약관 때문에 이름을 저장하지 않아서(name: null) placeId로 다시 불러와 보여준다.
// 네이버·TourAPI 장소는 저장된 이름을 바로 쓴다.
export function useItemName(item) {
  const { t } = useTranslation();
  const needsLookup = item.name === null;
  // id가 없으면 usePlace가 요청을 보내지 않는다
  const { data: place, isPending, isError } = usePlace(needsLookup ? item.placeId : null);

  if (!needsLookup) return item.name;
  if (isPending) return t('planner.item.nameLoading');
  if (isError) return t('planner.item.nameError');
  return place.name;
}
