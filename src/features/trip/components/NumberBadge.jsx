import { DAY_BORDER_CLASSES } from '../../map/constants';

// 목록 번호 원. 지도 마커와 같은 모양(흰 원 + DAY 색 테두리 + 어두운 숫자)이다.
export default function NumberBadge({ number, dayIndex }) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-8 shrink-0 place-items-center rounded-full border-4 bg-background text-body-sm font-bold text-text ${DAY_BORDER_CLASSES[dayIndex % DAY_BORDER_CLASSES.length]}`}
    >
      {number}
    </span>
  );
}
