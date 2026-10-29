import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/common/Button';
import { useCommunityStore } from '../../store/community/useCommunityStore';
import PlaceReviewModal from '../Community/PlaceReviewModal';
import RatingStars from '../Community/RatingStars';
import { getPlaceReviews, summarizeReviews } from '../Community/reviewUtils';

// 상세에서 미리 보여 줄 최신 후기 수. 나머지는 [후기 보기·쓰기] 모달에서 본다.
const PREVIEW_COUNT = 2;

// 장소 상세 Wandy 여행자 평점 (74). 커뮤니티 후기(105, A파트 더미 + 이 기기에 쓴 내 후기)를 모아 보여 준다.
// 히어로의 ★ 평점은 구글 평점이라, 섞여 보이지 않게 따로 섹션을 두고 출처를 문구로 밝힌다.
export default function WandyReviewSection({ place }) {
  const { t } = useTranslation();
  const titleId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const myReviews = useCommunityStore((state) => state.reviews);
  const reviews = getPlaceReviews(place.id, myReviews);
  const { average, count } = summarizeReviews(reviews);

  return (
    <section aria-labelledby={titleId} className="space-y-5">
      <div className="space-y-1">
        <h2 id={titleId} className="text-title font-bold">
          {t('place.wandyReviews.title')}
        </h2>
        <p className="text-body-sm text-text/70">{t('place.wandyReviews.description')}</p>
      </div>
      <div className="space-y-5 rounded-2xl bg-bg-soft p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {average === null ? (
            <p className="text-body font-bold">{t('place.wandyReviews.empty')}</p>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-display font-bold">{average}</span>
              <div className="space-y-0.5">
                <RatingStars rating={average} />
                <p className="text-body-sm text-text/70">
                  {t('place.wandyReviews.count', { count })}
                </p>
              </div>
            </div>
          )}
          <Button variant="secondary" onClick={() => setIsOpen(true)} className="w-full sm:w-auto">
            {count === 0 ? t('place.wandyReviews.writeFirst') : t('place.wandyReviews.open')}
          </Button>
        </div>
        {count > 0 ? (
          <ul aria-label={t('place.wandyReviews.recentLabel')} className="space-y-3">
            {reviews.slice(0, PREVIEW_COUNT).map((review) => (
              <li key={review.id} className="space-y-1 rounded-xl bg-background p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-body-sm font-bold">{review.author}</span>
                  <RatingStars rating={review.rating} />
                  <span className="text-caption text-text/60">{review.createdAt}</span>
                </div>
                <p className="line-clamp-3 text-body-sm whitespace-pre-line text-text/80">
                  {review.text}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {isOpen ? <PlaceReviewModal place={place} onClose={() => setIsOpen(false)} /> : null}
    </section>
  );
}
