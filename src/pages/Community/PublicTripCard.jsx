import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCommunityStore } from '../../store/community/useCommunityStore';
import { getLikeCount, getTripCoverSrc, getTripNights, getTripPlaceCount } from './publicTripUtils';

// 공개 일정 카드 (105). 카드 전체가 상세로 가는 링크다.
// 좋아요는 상세에서 누르고, 카드에는 숫자와 내가 눌렀는지만 보여 준다 (링크 안에 버튼을 넣을 수 없어서).
// 사진은 대표 장소의 Wikimedia 사진이고(출처는 목록 아래 TripPhotoCredits), 없으면 도시 사진이다.
export default function PublicTripCard({ trip }) {
  const { t } = useTranslation();
  const isLiked = useCommunityStore((state) => state.likedTripIds.includes(trip.id));
  const nights = getTripNights(trip);

  return (
    <Link
      to={`/community/${trip.id}`}
      className="motion-card-frame flex h-full flex-col overflow-hidden rounded-2xl border border-text/10 bg-background transition-colors hover:bg-bg-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div className="relative">
        <img
          src={getTripCoverSrc(trip)}
          alt=""
          loading="lazy"
          className="aspect-video w-full object-cover motion-card-image"
        />
        <span className="absolute top-3 left-3 rounded-full bg-background px-3 py-1 text-caption font-bold text-text">
          {t(`common.city.${trip.city}`)} ·{' '}
          {t('community.card.nightsDays', { nights, days: nights + 1 })}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-subtitle font-bold break-keep">{trip.title}</h3>
        <p className="line-clamp-2 text-body-sm text-text/70">{trip.summary}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2 text-caption text-text/60">
          <span>
            {trip.author} · {t(`wizard.style.companion.${trip.companion}`)} ·{' '}
            {t('community.card.placeCount', { count: getTripPlaceCount(trip) })}
          </span>
          <span className={`font-bold ${isLiked ? 'text-apricot-ink' : ''}`}>
            <span aria-hidden="true">{isLiked ? '♥' : '♡'}</span>{' '}
            <span className="sr-only">{t('community.like.label')}</span>
            {getLikeCount(trip, isLiked)}
          </span>
        </div>
      </div>
    </Link>
  );
}
