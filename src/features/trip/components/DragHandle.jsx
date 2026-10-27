// 장소 카드를 끌어 순서를 바꾸는 손잡이 (16). 카드 전체를 끌게 하면 "눌러서 선택"과 부딪혀서 손잡이로만 끈다.
// touch-none은 손가락으로 끌 때 화면이 같이 스크롤되지 않게 한다. 나머지 props는 dnd-kit이 주는 값이다.
export default function DragHandle({ label, ...dndProps }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid h-11 w-7 shrink-0 cursor-grab touch-none place-items-center rounded-xl text-text/50 hover:bg-text/5 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:cursor-grabbing"
      {...dndProps}
    >
      <span aria-hidden="true" className="grid grid-cols-2 gap-1">
        {[0, 1, 2, 3, 4, 5].map((dot) => (
          <span key={dot} className="size-1 rounded-full bg-current" />
        ))}
      </span>
    </button>
  );
}
