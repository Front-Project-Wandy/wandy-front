import { useTranslation } from 'react-i18next';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

// 작성 중인 여행이 있는데 새 여행을 시작하려 할 때 묻는 창.
// 하던 걸 실수로 날리지 않게, 덜 위험한 [이어서 만들기]를 primary로 둔다.
export default function StartTripConfirmModal({ open, onConfirm, onContinue, onClose }) {
  const { t } = useTranslation();

  return (
    <Modal open={open} onClose={onClose} title={t('home.confirm.title')}>
      <p className="text-body break-keep text-text/70">{t('home.confirm.description')}</p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
        <Button onClick={onContinue} className="sm:flex-1">
          {t('home.continue.action')}
        </Button>
        <Button variant="secondary" onClick={onConfirm} className="sm:flex-1">
          {t('home.confirm.newTrip')}
        </Button>
      </div>
    </Modal>
  );
}
