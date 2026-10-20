import { useTranslation } from 'react-i18next';

// 로딩·빈 화면·에러 안내. A파트 공통 컴포넌트(Loading·EmptyState·ErrorState)가 나오면 그걸로 바꾼다.
export default function StateMessage({ variant, title, description, onRetry }) {
  const { t } = useTranslation();
  const heading =
    title ?? (variant === 'loading' ? t('common.state.loading') : t('common.state.error'));

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className="rounded-2xl bg-bg-soft px-4 py-8 text-center"
    >
      <p
        className={`text-body font-bold ${variant === 'error' ? 'text-error' : 'text-text'} ${variant === 'loading' ? 'animate-pulse' : ''}`}
      >
        {heading}
      </p>
      {description ? <p className="mt-1 text-body-sm text-text/70">{description}</p> : null}
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 h-12 rounded-xl bg-primary px-5 text-body font-bold text-white"
        >
          {t('common.action.retry')}
        </button>
      ) : null}
    </div>
  );
}
