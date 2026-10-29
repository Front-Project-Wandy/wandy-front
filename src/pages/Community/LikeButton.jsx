import { useTranslation } from 'react-i18next';
import { useCommunityStore } from '../../store/community/useCommunityStore';
import { getLikeCount } from './publicTripUtils';

// 공개 일정 좋아요 (105). 눌린 상태를 aria-pressed로 알려 화면 낭독기가 「선택됨」을 읽게 한다.
// 하트는 point 색(찜·배지와 같은 작은 강조)만 쓴다.
export default function LikeButton({ trip }) {
  const { t } = useTranslation();
  const isLiked = useCommunityStore((state) => state.likedTripIds.includes(trip.id));
  const toggleLike = useCommunityStore((state) => state.toggleLike);

  return (
    <button
      type="button"
      aria-pressed={isLiked}
      onClick={() => toggleLike(trip.id)}
      className="inline-flex h-11 items-center gap-2 rounded-xl border border-text/20 px-4 text-body font-bold motion-press transition-colors hover:bg-bg-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span aria-hidden="true" className={isLiked ? 'text-point' : 'text-text/60'}>
        {isLiked ? '♥' : '♡'}
      </span>
      {t('community.like.label')}
      <span className="text-text/70">{getLikeCount(trip, isLiked)}</span>
    </button>
  );
}
