import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath, useLocation } from 'react-router-dom';
import { focusMain } from './focusMain';
import { setPageTitle } from './setPageTitle';

// 경로 → 브라우저 탭 제목 키. App.jsx의 경로 목록과 같게 맞춘다. 없는 경로는 404.
const ROUTE_TITLES = [
  { path: '/', key: 'home' },
  { path: '/places', key: 'places' },
  { path: '/place/:id', key: 'place' },
  { path: '/community', key: 'community' },
  { path: '/community/:id', key: 'communityTrip' },
  { path: '/products', key: 'products' },
  { path: '/login', key: 'login' },
  { path: '/signup', key: 'signup' },
  { path: '/my', key: 'my' },
  { path: '/trip/:id', key: 'trip' },
];

// 화면 이동 뒤 탭 제목과 포커스 (90 접근성).
// SPA는 화면이 바뀌어도 새 페이지를 불러오지 않아서, 탭 제목이 그대로고 포커스도 누른 링크 자리에 남는다.
// 그래서 화면 낭독기 사용자는 화면이 바뀐 걸 모른다. 경로가 바뀌면 제목을 바꾸고 포커스를 본문으로 옮긴다.
// 처음 열 때는 옮기지 않는다 (브라우저가 페이지를 새로 읽어 주고, 본문 바로가기를 먼저 만나야 해서).
// "첫 렌더인가"가 아니라 "직전 경로와 다른가"로 판단한다. 개발 모드(StrictMode)는 effect를 두 번 돌려서
// 첫 렌더 표시는 두 번째에 꺼져 버리고, 홈과 다른 화면은 App.jsx에서 레이아웃이 따로라 이동할 때
// AppLayout이 새로 만들어져 컴포넌트 안(ref)에 둔 값은 사라진다. 그래서 직전 경로를 모듈에 둔다.
const lastRoute = { key: null };

// 직전 화면과 다른 화면이면 true. 처음 열었을 때(직전 없음)와 같은 화면을 다시 그릴 때는 false.
// 마법사처럼 AppLayout 밖 화면도 이 함수로 기록해야, 거기서 돌아올 때 화면 이동으로 알아챈다.
export function isRouteChange(routeKey) {
  const previous = lastRoute.key;
  lastRoute.key = routeKey;
  return previous !== null && previous !== routeKey;
}

export function useRouteFocus() {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    const matched = ROUTE_TITLES.find(({ path }) => matchPath(path, pathname));
    const key = matched?.key ?? 'notFound';
    setPageTitle(t, key === 'home' ? null : t(`common.pageTitle.${key}`));

    if (isRouteChange(pathname)) focusMain();
  }, [pathname, t]);
}
