import FlipCard from '../../vendor/reactbits/FlipCard';

// 장소·상품·도시 카드가 같이 쓰는 뒤집히는 카드 (React Bits Flip Card를 우리 테마에 맞춘 것).
// 누르면 뒷면(자세한 정보·이동 버튼)으로 뒤집힌다. 상세로 가는 건 뒷면의 버튼이 한다.
// 크기는 칸에 맞춘다: 원본은 px 고정이라 너비는 칸 전체, 높이는 className의 aspect-*로 정한다.
// 색은 테마 변수를 넘겨서 다크 모드에서도 바탕·글자가 같이 바뀐다.
// draggable={false}: 가로로 넘기는 목록 안에서는 끌어서 뒤집기가 목록 스크롤과 부딪혀서 끈다
//   (손가락 가로 밀기를 막는 touch-action도 풀어서 목록이 넘어가게 한다).
export default function FlipCardFrame({
  front,
  back,
  ariaLabel,
  draggable = true,
  disabled = false,
  className = '',
}) {
  return (
    <FlipCard
      front={front}
      back={back}
      ariaLabel={ariaLabel}
      draggable={draggable}
      disabled={disabled}
      width={4000}
      radius={16}
      tiltMax={8}
      glareOpacity={0.18}
      hoverScale={1.02}
      background="var(--color-background)"
      color="var(--color-text)"
      shadowColor="var(--color-ink)"
      shadowOpacity={0.22}
      className={`block! w-full! h-auto! focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${draggable ? '' : 'touch-auto!'} ${className}`}
    />
  );
}
