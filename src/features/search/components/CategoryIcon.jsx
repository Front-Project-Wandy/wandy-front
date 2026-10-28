// 장소 카테고리 선 아이콘. 사진이 없는 카드·히어로와 아이콘 칩에서 같이 쓴다.
// category가 null이면 「전체」 아이콘이다. 장식이라 낭독기에는 숨기고, 이름은 옆 글자가 알려 준다.
const ICON_PATHS = {
  all: 'M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z',
  sight: 'M3 21h18M5 21V11m14 10V11M9 21v-6h6v6M2 11l10-7 10 7',
  food: 'M7 3v18M4 3v5a3 3 0 0 0 6 0V3m7 18V3c-2 2-3 5-3 8h3',
  cafe: 'M4 8h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Zm12 2h2a2 2 0 0 1 0 4h-2M8 3v2m4-2v2',
  shop: 'M5 8h14l-1 13H6L5 8Zm4 0V6a3 3 0 0 1 6 0v2',
  nature: 'M2 20 9 8l4 6 3-4 6 10H2Z',
  night: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z',
  onsen:
    'M4 17c0 2.2 3.6 4 8 4s8-1.8 8-4c0-1.5-1.8-2.8-4.5-3.5M8.5 13.5C5.8 14.2 4 15.5 4 17M9 4c-1 1.5 1 2.5 0 4s1 2.5 0 4m3-9c-1 1.5 1 2.5 0 4s1 2.5 0 4m3-7c-1 1.5 1 2.5 0 4s1 2.5 0 4',
};

export default function CategoryIcon({ category, size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={ICON_PATHS[category ?? 'all'] ?? ICON_PATHS.all} />
    </svg>
  );
}
