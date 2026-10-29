import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import { useShareActions } from '../hooks/useShareActions';
import { buildShareData } from '../utils/buildShareData';
import { formatShareText } from '../utils/formatShareText';

// 일정 공유·내보내기 창 (요구사항 #72): 글 복사, 공유 시트(카카오톡·LINE 포함), 인쇄(PDF로 저장).
// 읽기 전용 공유 링크는 서버에 일정을 저장해야 해서 2단계에서 한다.
export default function ShareTripDialog({ open, onClose, trip, onPrint }) {
  const { t, i18n } = useTranslation();
  const data = useMemo(() => buildShareData(trip), [trip]);
  const text = useMemo(
    () => formatShareText({ data, t, locale: i18n.language }),
    [data, t, i18n.language],
  );
  const { status, canShare, copy, share, resetStatus } = useShareActions({
    title: data.title || t('planner.share.untitled'),
    text,
  });

  // 이 창은 닫아도 그려져 있어서 안내 글자가 남는다. 닫거나 인쇄로 넘어갈 때, 그리고 열 때 지운다.
  // 열 때도 지우는 것은 복사가 창을 닫은 뒤에 끝나 안내가 다시 생기는 경우를 막으려는 것이다.
  useEffect(() => {
    if (open) resetStatus();
  }, [open, resetStatus]);
  const handleClose = () => {
    resetStatus();
    onClose();
  };
  const handlePrint = () => {
    resetStatus();
    onPrint();
  };

  return (
    <Modal open={open} onClose={handleClose} title={t('planner.share.title')}>
      <div className="space-y-4">
        <textarea
          readOnly
          rows={10}
          value={text}
          aria-label={t('planner.share.previewLabel')}
          className="w-full rounded-xl border border-text/10 bg-bg-soft p-3 text-body-sm"
        />
        {data.hasHiddenName ? (
          <p className="text-body-sm text-text/70">{t('planner.share.googleNote')}</p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button onClick={copy}>{t('planner.share.copy')}</Button>
          {canShare ? (
            <Button variant="secondary" onClick={share}>
              {t('planner.share.share')}
            </Button>
          ) : null}
          <Button variant="secondary" onClick={handlePrint}>
            {t('planner.share.print')}
          </Button>
        </div>
        <p role="status" className="min-h-5 text-body-sm text-text/70">
          {status ? t(`planner.share.status.${status}`) : ''}
        </p>
      </div>
    </Modal>
  );
}
