import { useTranslation } from 'react-i18next';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { useCommunityStore } from '../../store/community/useCommunityStore';
import MyReviewList from './MyReviewList';
import PublicTripCard from './PublicTripCard';
import TripPhotoCredits from './TripPhotoCredits';
import { findPublicTrip } from './publicTripUtils';

// 「내 활동」 탭 (105). 좋아요한 일정과 내가 쓴 후기를 모아 본다. 둘 다 이 기기(localStorage)에 저장된 것이다.
// 좋아요한 일정이 목업에서 사라졌으면 건너뛴다. 빈 화면에서는 둘러보기 탭으로 보내 막다른 길이 되지 않게 한다.
export default function MyActivity({ onBrowse }) {
  const { t } = useTranslation();
  const likedTripIds = useCommunityStore((state) => state.likedTripIds);
  const reviewCount = useCommunityStore((state) => state.reviews.length);
  const likedTrips = likedTripIds.map(findPublicTrip).filter(Boolean);
  const browseAction = (
    <Button variant="secondary" onClick={onBrowse}>
      {t('community.activity.browse')}
    </Button>
  );

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="community-liked-title" className="flex flex-col gap-4">
        <h2 id="community-liked-title" className="text-subtitle font-bold">
          {t('community.activity.liked', { count: likedTrips.length })}
        </h2>
        {likedTrips.length === 0 ? (
          <EmptyState
            title={t('community.activity.likedEmpty.title')}
            description={t('community.activity.likedEmpty.description')}
            action={browseAction}
          />
        ) : (
          <>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {likedTrips.map((trip) => (
                <li key={trip.id}>
                  <PublicTripCard trip={trip} />
                </li>
              ))}
            </ul>
            <TripPhotoCredits trips={likedTrips} />
          </>
        )}
      </section>
      <section aria-labelledby="community-reviews-title" className="flex flex-col gap-4">
        <h2 id="community-reviews-title" className="text-subtitle font-bold">
          {t('community.activity.reviews', { count: reviewCount })}
        </h2>
        {reviewCount === 0 ? (
          <EmptyState
            title={t('community.activity.reviewsEmpty.title')}
            description={t('community.activity.reviewsEmpty.description')}
            action={browseAction}
          />
        ) : (
          <MyReviewList />
        )}
      </section>
    </div>
  );
}
