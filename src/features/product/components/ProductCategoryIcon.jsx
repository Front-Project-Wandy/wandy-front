// 상품 종류 아이콘. 목록의 둥근 종류 바로가기와, 사진이 없는 상품 카드의 대체 그림에 같이 쓴다.
// 홈 바로가기(HomeShortcuts)와 같은 가는 선 아이콘이다. 'all'은 전체.
const ICON_PATHS = {
  all: 'M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z',
  tour: 'M5 21V4m0 0h12l-2.5 4L17 12H5',
  ticket: 'M3 5h18v5a2 2 0 0 0 0 4v5H3v-5a2 2 0 0 0 0-4V5Zm12 0v3m0 3v2m0 3v3',
  pass: 'M7 3h10a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Zm-3 8h16M8 14.5h.01M16 14.5h.01M8 18l-2 3m10-3 2 3',
  activity: 'M2 20 9 8l4 6 3-4 6 10H2Zm14-12.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  snap: 'M4 8h3l2-3h6l2 3h3v11H4V8Zm8 8.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
};

export default function ProductCategoryIcon({ category, size = 28, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={ICON_PATHS[category] ?? ICON_PATHS.all} />
    </svg>
  );
}
