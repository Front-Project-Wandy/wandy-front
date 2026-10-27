import { useTranslation } from 'react-i18next';
import Spinner from './Spinner';

// 데이터를 기다리는 동안 보여주는 화면 (와이어프레임 Q01 "로딩").
// text가 없으면 공통 문구를 쓰고, 화면별로 "장소를 불러오는 중…"처럼 바꿔 쓸 수 있다.
// role="status"는 화면 낭독기가 지금 하던 말을 끊지 않고 이어서 문구를 읽어 주게 한다.
export default function Loading({ text, className = '' }) {
  const { t } = useTranslation();

  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center gap-3 py-12 text-center ${className}`}
    >
      <span className="text-primary">
        <Spinner size="lg" />
      </span>
      <p className="text-body-sm text-text/70">{text ?? t('common.state.loading')}</p>
    </div>
  );
}
