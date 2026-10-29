import { useMemo } from 'react';
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
  const { status, canShare, copy, share } = useShareActions({
    title: data.title || t('planner.share.untitled'),
    text,
  });

  return (
    <Modal open={open} onClose={onClose} title={t('planner.share.title')}>
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
          <Button variant="secondary" onClick={onPrint}>
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
