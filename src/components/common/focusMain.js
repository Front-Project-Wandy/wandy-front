// 화면의 <main>으로 키보드 포커스를 옮긴다 (90 접근성). 본문 바로가기와 화면 이동 뒤에 쓴다.
// main은 원래 포커스를 받지 않는 요소라 tabindex="-1"을 붙여 코드로만 포커스할 수 있게 한다
// (0을 주면 Tab 순서에 끼어들어서 -1). 페이지마다 main에 id를 달지 않아도 되게 태그로 찾는다.
export function focusMain() {
  const main = document.querySelector('main');
  if (!main) return;
  if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
  main.focus();
}
