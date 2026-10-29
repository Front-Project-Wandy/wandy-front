import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import { deleteAccountData } from '../utils/deleteAccountData';

// 지워지는 기록 (deleteAccountData가 지우는 저장 키 순서와 맞춘다).
const DELETED_ITEMS = [
  'trips',
  'tripRecords',
  'favorites',
  'ratings',
  'preferences',
  'community',
  'recent',
  'account',
];

// 진한 빨강 대신 살구 면·글자로 위험한 버튼임을 보여 준다 (따뜻한 색은 면·글자에만).
const DANGER_BUTTON_CLASS =
  'inline-flex h-11 items-center justify-center rounded-xl border border-apricot-ink/30 bg-apricot-soft px-4 text-body font-bold text-apricot-ink transition-colors enabled:hover:border-apricot-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50';

// 회원 탈퇴 확인 창 (68). 지워지는 기록을 보여 주고, 확인 체크를 해야 탈퇴 버튼이 눌린다.
// 탈퇴가 끝나면 같은 창에서 완료를 알리고, 닫으면 홈으로 보낸다.
export default function WithdrawModal({ open, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isChecked, setIsChecked] = useState(false);
  // 'idle' | 'pending' | 'done' | 'error'
  const [status, setStatus] = useState('idle');
  const isDone = status === 'done';

  // dialog는 닫아도 화면에 남아 있어서, 다시 열 때 체크가 켜져 있지 않게 닫을 때 되돌린다.
  const handleClose = () => {
    if (status === 'pending') return;
    if (isDone) {
      navigate('/');
      return;
    }
    setIsChecked(false);
    setStatus('idle');
    onClose();
  };

  const handleWithdraw = async () => {
    setStatus('pending');
    try {
      await deleteAccountData(queryClient);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={t(isDone ? 'my.withdraw.doneTitle' : 'my.withdraw.modalTitle')}
    >
      {isDone ? (
        <div className="space-y-4">
          <p role="status" className="text-body break-keep">
            {t('my.withdraw.done')}
          </p>
          <Button onClick={handleClose} className="w-full">
            {t('my.withdraw.home')}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-body-sm break-keep">{t('my.withdraw.listIntro')}</p>
          <ul className="list-disc space-y-1 rounded-2xl bg-bg-soft py-3 pr-4 pl-8 text-body-sm break-keep">
            {DELETED_ITEMS.map((key) => (
              <li key={key}>{t(`my.withdraw.items.${key}`)}</li>
            ))}
          </ul>
          <p className="text-caption text-text/60 break-keep">{t('my.withdraw.kept')}</p>
          <label className="flex items-start gap-2 text-body-sm font-bold">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(event) => setIsChecked(event.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-primary"
            />
            <span>{t('my.withdraw.confirm')}</span>
          </label>
          {status === 'error' ? (
            <p role="alert" className="text-body-sm text-error">
              {t('my.withdraw.error')}
            </p>
          ) : null}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={handleClose} disabled={status === 'pending'}>
              {t('my.withdraw.cancel')}
            </Button>
            <button
              type="button"
              onClick={handleWithdraw}
              disabled={!isChecked || status === 'pending'}
              aria-busy={status === 'pending'}
              className={DANGER_BUTTON_CLASS}
            >
              {t('my.withdraw.submit')}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
