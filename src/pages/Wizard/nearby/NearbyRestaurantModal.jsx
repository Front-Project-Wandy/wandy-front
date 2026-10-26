import { useTranslation } from 'react-i18next';
import Modal from '../../../components/common/Modal';
import NearbyRestaurants from '../../../features/restaurant/components/NearbyRestaurants';

// [근처 식당] 창. 목록·음식 종류 필터·구글 출처 표시는 B파트 NearbyRestaurants가 맡는다 (22·44).
// 다른 장소를 열면 필터가 처음으로 돌아가도록 key={place.id}를 준다 (NearbyRestaurants 주석).
// 방문 시각을 아직 정하지 않는 마법사라 식사 시간(mealTime, 45)은 넘기지 않는다.
export default function NearbyRestaurantModal({ place, onSelect, onClose }) {
  const { t } = useTranslation();

  return (
    <Modal
      open={place !== null}
      onClose={onClose}
      title={place ? t('wizard.nearby.modalTitle', { name: place.name }) : ''}
    >
      {place && <NearbyRestaurants key={place.id} place={place} onSelectPlace={onSelect} />}
    </Modal>
  );
}
