import Spinner from './Spinner';

// 흰 글자는 primary 위에서만, 굵게 쓴다 (디자인 규칙).
// hover는 enabled: 를 붙여서 비활성 버튼에서는 색이 바뀌지 않게 했다.
const VARIANT_CLASS = {
  primary: 'bg-primary text-white enabled:hover:bg-primary/90',
  secondary: 'border border-primary bg-background text-primary enabled:hover:bg-bg-soft',
  ghost: 'text-text enabled:hover:bg-text/5',
};

// 흰 글자는 16px 이상이어야 해서 가장 작은 버튼도 text-body(16px)를 쓴다.
// md 높이 44px은 손가락으로 누르기 편한 최소 크기다.
const SIZE_CLASS = {
  sm: 'h-9 px-3 text-body',
  md: 'h-11 px-4 text-body',
  lg: 'h-13 px-6 text-subtitle',
};

// className은 바깥 여백·너비(mt-4, w-full 등) 같은 배치용으로만 받는다.
export default function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  children,
  ...rest
}) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold motion-press transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className}`}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
