import { useTranslation } from 'react-i18next';
import { focusMain } from './focusMain';

// 본문 바로가기 (90 접근성). 평소엔 숨어 있다가 Tab을 처음 누르면 화면 왼쪽 위에 나타난다.
// 키보드 사용자가 화면마다 헤더 메뉴를 하나씩 지나지 않고 본문으로 바로 갈 수 있게 한다.
// href="#main"으로 이동하면 페이지마다 main에 id가 필요해서, 누를 때 main을 찾아 포커스한다.
export default function SkipLink() {
  const { t } = useTranslation();

  const handleClick = (event) => {
    event.preventDefault();
    focusMain();
  };

  return (
    <a
      href="#main"
      onClick={handleClick}
      // not-sr-only가 padding을 0으로 되돌려서, 여백은 focus: 쪽에 준다.
      className="sr-only rounded-xl bg-primary text-body font-bold text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2"
    >
      {t('common.a11y.skipToContent')}
    </a>
  );
}
