import { useTranslation } from 'react-i18next';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { useAuthStore } from '../../features/member/hooks/useAuthStore';
import { useCommunityStore } from '../../store/community/useCommunityStore';
import RatingStars from './RatingStars';
import ReviewForm from './ReviewForm';
import ReviewItem from './ReviewItem';
import { getPlaceReviews, summarizeReviews } from './reviewUtils';

// 장소 후기 모달 (105). 평균 별점, 후기 쓰기, 후기 목록.
// 작성자 이름은 로그인한 이름을 쓰고, 로그인하지 않았거나 게스트면 「게스트」로 남긴다.
// 내 후기는 이 기기에만 저장돼서(1단계) 다른 사람에게는 보이지 않는다고 안내한다.
// 열 때마다 처음 상태로 시작하도록 부모가 place가 있을 때만 그린다.
export default function PlaceReviewModal({ place, onClose }) {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const myReviews = useCommunityStore((state) => state.reviews);
  const addReview = useCommunityStore((state) => state.addReview);
  const updateReview = useCommunityStore((state) => state.updateReview);
  const removeReview = useCommunityStore((state) => state.removeReview);
  const reviews = getPlaceReviews(place.id, myReviews);
  const { average, count } = summarizeReviews(reviews);
  const authorName =
    user && user.provider !== 'guest' ? user.name : t('community.review.guestName');

  return (
    <Modal open onClose={onClose} title={t('community.review.title', { name: place.name })}>
      <div className="flex flex-col gap-5">
        <p className="flex items-center gap-2 text-body font-bold">
          {average === null ? (
            t('community.review.noRating')
          ) : (
            <>
              <RatingStars rating={average} />
              {t('community.review.summary', { average, count })}
            </>
          )}
        </p>
        <ReviewForm
          onSubmit={(values) => addReview({ placeId: place.id, authorName, ...values })}
        />
        <p className="text-caption text-text/60">{t('community.review.localNotice')}</p>
        {reviews.length === 0 ? (
          <EmptyState
            title={t('community.review.empty.title')}
            description={t('community.review.empty.description')}
          />
        ) : (
          <ul aria-label={t('community.review.listLabel')}>
            {reviews.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                onUpdate={updateReview}
                onRemove={removeReview}
              />
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}
