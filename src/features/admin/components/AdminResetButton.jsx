import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import { useAdminActions } from '../hooks/useAdminActions';

// [초기화] — 숨김·추천 고정·추천 장소 숨김을 한 번에 지운다. 되돌릴 수 없어서 한 번 더 묻는다.
// 실수로 지우지 않게 덜 위험한 [취소]를 primary로 둔다 (StartTripConfirmModal과 같은 기준).
export default function AdminResetButton() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { reset } = useAdminActions();

  const handleConfirm = () => {
    reset();
    setOpen(false);
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {t('admin.reset.action')}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title={t('admin.reset.title')}>
        <p className="text-body break-keep text-text/70">{t('admin.reset.description')}</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
          <Button onClick={() => setOpen(false)} className="sm:flex-1">
            {t('admin.reset.cancel')}
          </Button>
          <Button variant="secondary" onClick={handleConfirm} className="sm:flex-1">
            {t('admin.reset.confirm')}
          </Button>
        </div>
      </Modal>
    </>
  );
}
