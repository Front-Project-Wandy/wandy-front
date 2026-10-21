import { useTranslation } from 'react-i18next';
import Button from './Button';

// 데이터를 불러오지 못했을 때의 화면 (와이어프레임 Q01 "에러").
// message가 없으면 공통 문구를 쓰고, onRetry가 있을 때만 다시 시도 버튼을 보여준다.
// role="alert"는 status와 달리 화면 낭독기가 하던 말을 끊고 바로 읽게 한다 (급한 알림).
export default function ErrorState({ message, onRetry, className = '' }) {
  const { t } = useTranslation();

  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center gap-3 px-4 py-12 text-center ${className}`}
    >
      <p className="text-body text-error">{message ?? t('common.state.error')}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          {t('common.action.retry')}
        </Button>
      )}
    </div>
  );
}
