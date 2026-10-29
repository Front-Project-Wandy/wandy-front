import { useTranslation } from 'react-i18next';
import ErrorState from '../../../components/common/ErrorState';
import Loading from '../../../components/common/Loading';
import Modal from '../../../components/common/Modal';
import GoogleAttribution from '../../search/components/GoogleAttribution';
import { useLocalPlaceInfo } from '../hooks/useLocalPlaceInfo';

// 택시 기사에게 보여 주는 현지어 이름·주소 화면 (요구사항 #94). 글자를 크게 띄운다.
// 구글 장소의 이름·주소를 보여 주므로 구글 표기를 함께 둔다 (약관).
export default function LocalNameDialog({ open, onClose, placeId, displayName }) {
  const { t } = useTranslation();
  const { data, isPending, isError, refetch } = useLocalPlaceInfo(placeId, open);

  const renderBody = () => {
    if (isPending) return <Loading text={t('planner.local.loading')} className="py-6" />;
    if (isError) {
      return <ErrorState message={t('planner.local.error')} onRetry={refetch} className="py-6" />;
    }
    return (
      <div className="space-y-4 py-4 text-center">
        <p className="text-body-sm text-text/70">{t('planner.local.hint')}</p>
        <p lang="ja" className="text-display font-bold break-keep">
          {data.name}
        </p>
        <p lang="ja" className="text-title break-keep">
          {data.address}
        </p>
        <GoogleAttribution />
      </div>
    );
  };

  return (
    <Modal open={open} onClose={onClose} title={t('planner.local.title', { name: displayName })}>
      {renderBody()}
    </Modal>
  );
}
