// 장소·상품·여행 카드의 바탕 상자.
// 카드는 대부분 사진이 위쪽 끝까지 꽉 차서 안쪽 여백(padding)을 두지 않고,
// 글자 부분만 쓰는 쪽에서 p-4 등으로 감싼다. overflow-hidden은 사진 모서리를 둥글게 자르기 위해서다.
const BASE_CLASS = 'overflow-hidden rounded-2xl border border-text/10 bg-background';

// onClick이 있으면 키보드로도 누를 수 있게 button으로 그린다.
// button 안에는 다른 버튼을 넣을 수 없으니, 찜 버튼처럼 안에 버튼이 있는 카드는 onClick 없이 쓴다.
export default function Card({ children, onClick, className = '', ...rest }) {
  if (onClick) {
    return (
      <button
        {...rest}
        type="button"
        onClick={onClick}
        className={`${BASE_CLASS} block w-full text-left transition-colors hover:bg-bg-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <div {...rest} className={`${BASE_CLASS} ${className}`}>
      {children}
    </div>
  );
}
