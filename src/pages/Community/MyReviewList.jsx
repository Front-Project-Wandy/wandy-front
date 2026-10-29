import { useQueries } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { placeQuery } from '../../features/search/hooks/usePlace';
import { getPlacePath } from '../../features/search/place';
import { useCommunityStore } from '../../store/community/useCommunityStore';
import ReviewItem from './ReviewItem';
import { getPlaceReviews } from './reviewUtils';

// 「내 활동」의 내가 쓴 후기 (105). 후기에는 placeId만 있어서 장소 이름은 다시 불러온다.
// 장소 이름은 장소 상세로 가는 링크로 둔다. 고치기·지우기는 후기 모달과 같은 ReviewItem을 쓴다.
// 장소를 못 불러와도 후기는 지울 수 있게 이름 자리에만 안내를 둔다.
export default function MyReviewList() {
  const { t } = useTranslation();
  const myReviews = useCommunityStore((state) => state.reviews);
  const updateReview = useCommunityStore((state) => state.updateReview);
  const removeReview = useCommunityStore((state) => state.removeReview);
  const placeIds = [...new Set(myReviews.map((review) => review.placeId))];
  const queries = useQueries({ queries: placeIds.map((id) => placeQuery(id)) });

  return (
    <ul className="flex flex-col gap-4">
      {placeIds.map((placeId, index) => {
        const { data: place, isPending } = queries[index];
        const reviews = getPlaceReviews(placeId, myReviews).filter((review) => review.isMine);
        return (
          <li key={placeId} className="rounded-2xl border border-text/10 px-4 pt-4">
            {place ? (
              <Link
                to={getPlacePath(place)}
                className="rounded-xl text-body font-bold text-link focus-visible:outline-2 focus-visible:outline-primary"
              >
                {place.name}
              </Link>
            ) : (
              <p className="text-body font-bold text-text/60">
                {isPending
                  ? t('community.detail.loadingName')
                  : t('community.activity.missingPlace')}
              </p>
            )}
            <ul>
              {reviews.map((review) => (
                <ReviewItem
                  key={review.id}
                  review={review}
                  onUpdate={updateReview}
                  onRemove={removeReview}
                />
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}
