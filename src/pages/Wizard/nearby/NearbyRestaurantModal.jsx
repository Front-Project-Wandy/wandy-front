import { useTranslation } from 'react-i18next';
import Modal from '../../../components/common/Modal';
import NearbyRestaurants from '../../../features/restaurant/components/NearbyRestaurants';

// [근처 식당] 창. 목록·음식 종류 필터·구글 출처 표시는 B파트 NearbyRestaurants가 맡는다 (22·44).
// 다른 장소를 열면 필터가 처음으로 돌아가도록 key={place.id}를 준다 (NearbyRestaurants 주석).
// 방문 시각을 아직 정하지 않는 마법사라 식사 시간(mealTime, 45)은 넘기지 않는다.
// 구글 장소 이름은 출처와 같이 보여야 하는데(약관, 요구사항 5) NearbyRestaurants는 식당이 있을 때만 출처를 그린다.
// 창에서도 출처를 그리면 식당이 있을 때 두 번 보여서, 구글 장소면 제목에서 이름을 빼 출처 없이 보이는 이름을 없앤다.
// (어느 장소 근처인지는 그 장소 옆 [근처 식당] 버튼으로 열어서 알 수 있다)
export default function NearbyRestaurantModal({ place, onSelect, onClose }) {
  const { t } = useTranslation();
  const title = !place
    ? ''
    : place.source === 'google'
      ? t('wizard.nearby.modalTitleNoName')
      : t('wizard.nearby.modalTitle', { name: place.name });

  return (
    <Modal open={place !== null} onClose={onClose} title={title}>
      {place && <NearbyRestaurants key={place.id} place={place} onSelectPlace={onSelect} />}
    </Modal>
  );
}
