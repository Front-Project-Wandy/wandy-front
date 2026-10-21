// 크기별 Tailwind 클래스. 큰 스피너는 테두리도 두껍게 해야 비율이 맞는다.
const SIZE_CLASS = {
  sm: 'size-4 border-2',
  md: 'size-6 border-2',
  lg: 'size-10 border-4',
};

// Button(loading)과 Loading이 같이 쓰는 원형 스피너.
// 색은 글자 색(currentColor)을 따라가서, 흰 글자 버튼 위에서도 본문 위에서도 따로 색을 정할 필요가 없다.
// 뜻은 옆의 글자(Loading 문구, 버튼 글자)가 전달하므로 화면 낭독기에서는 숨긴다.
export default function Spinner({ size = 'md' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block animate-spin rounded-full border-current border-t-transparent ${SIZE_CLASS[size]}`}
    />
  );
}
