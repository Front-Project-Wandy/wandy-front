import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../hooks/useAuthStore';
import WithdrawModal from './WithdrawModal';

// 마이페이지 회원 탈퇴 (68). 실수로 누르지 않게 맨 아래에 작은 글자 버튼으로만 둔다.
// 게스트는 지울 계정이 없어서 보여 주지 않는다 (2단계에서도 게스트 기록은 이 기기에만 남는다).
export default function WithdrawSection() {
  const { t } = useTranslation();
  const titleId = useId();
  const user = useAuthStore((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const isMember = Boolean(user) && user.provider !== 'guest';

  // 탈퇴하면 user가 바로 null이 되는데, 완료 안내를 보여 주는 동안은 창이 사라지지 않게 남긴다.
  if (!isMember && !isOpen) return null;

  return (
    <section aria-labelledby={titleId} className="rounded-2xl border border-text/10 p-4 lg:p-5">
      <h2 id={titleId} className="text-body font-bold">
        {t('my.withdraw.title')}
      </h2>
      <p className="mt-1 text-body-sm text-text/70 break-keep">{t('my.withdraw.description')}</p>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-3 rounded text-body-sm text-text/70 underline hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {t('my.withdraw.open')}
      </button>
      <WithdrawModal open={isOpen} onClose={() => setIsOpen(false)} />
    </section>
  );
}
