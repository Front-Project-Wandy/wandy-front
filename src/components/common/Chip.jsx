// 카테고리·국가 같은 선택지를 고르는 칩.
// 선택 여부를 aria-pressed로 알려서 화면 낭독기가 "선택됨"을 읽게 한다.
// brand 배경 위에는 흰 글자를 쓰지 않는 규칙이라 선택돼도 글자는 진한 색이다.
// text는 다크모드에서 밝아져서 brand 위에서 안 보이므로, 테마와 상관없이 진한 ink를 쓴다.
export default function Chip({ label, selected = false, onClick, className = '', ...rest }) {
  return (
    <button
      {...rest}
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex h-9 shrink-0 items-center rounded-full border px-4 text-body-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        selected
          ? 'border-brand bg-brand text-ink'
          : 'border-text/20 bg-background text-text/70 hover:bg-bg-soft'
      } ${className}`}
    >
      {label}
    </button>
  );
}
