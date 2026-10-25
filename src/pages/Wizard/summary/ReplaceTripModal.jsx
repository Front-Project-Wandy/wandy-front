import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';

// 플랜 store(C)가 지금 여행을 하나만 저장해서, 새로 저장하면 이전 여행이 사라진다. 그 전에 묻는 창.
export default function ReplaceTripModal({ open, previousTitle, onConfirm, onClose }) {
  const { t } = useTranslation();

  return (
    <Modal open={open} onClose={onClose} title={t('wizard.summary.replace.title')}>
      <p className="text-body break-keep text-text/70">
        {t('wizard.summary.replace.description', { title: previousTitle })}
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
        <Button onClick={onConfirm} className="sm:flex-1">
          {t('wizard.summary.replace.confirm')}
        </Button>
        <Button variant="secondary" onClick={onClose} className="sm:flex-1">
          {t('wizard.summary.replace.cancel')}
        </Button>
      </div>
    </Modal>
  );
}
