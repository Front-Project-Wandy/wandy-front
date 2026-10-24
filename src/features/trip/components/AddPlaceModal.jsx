import Modal from '../../../components/common/Modal';
import PlaceSearchPanel from '../../search/components/PlaceSearchPanel';

// DAY에 넣을 장소를 검색해서 고르는 창. 닫혀 있을 때는 검색 화면을 그리지 않아서,
// 다시 열면 검색어·카테고리가 처음 상태이고 필요 없는 요청도 보내지 않는다.
export default function AddPlaceModal({ open, onClose, title, country, city, onSelectPlace }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="max-h-96 overflow-y-auto">
        {open ? (
          <PlaceSearchPanel country={country} city={city} onSelectPlace={onSelectPlace} />
        ) : null}
      </div>
    </Modal>
  );
}
