import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// 다른 화면으로 이동하면 맨 위부터 보이게 한다.
// SPA는 화면이 바뀌어도 새 페이지를 불러오지 않아서, 앞 화면에서 내린 스크롤이 그대로 남는다
// (홈을 내린 채 [시작]을 누르면 마법사 진행 표시줄과 제목이 안 보인다).
// 뒤로·앞으로 가기(POP)와 첫 로드는 브라우저가 위치를 맞추게 두고, #해시 이동은 그 자리로 가야 해서 뺀다.
// 홈과 다른 화면은 레이아웃이 따로라(App.jsx) 이동하면 새로 그려지는데, 그때도 effect가 돌아서 같이 처리된다.
export function useScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP' || hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash, navigationType]);
}
