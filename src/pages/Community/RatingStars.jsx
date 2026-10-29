import { useTranslation } from 'react-i18next';
import { MAX_RATING } from './reviewUtils';

// 별점 보기 (105). 별 모양은 화면 낭독기가 읽지 않게 숨기고 「별점 4점」을 따로 읽힌다.
export default function RatingStars({ rating }) {
  const { t } = useTranslation();
  const filled = Math.round(rating);

  return (
    <span className="inline-flex items-center text-body-sm text-gold">
      <span aria-hidden="true">
        {'★'.repeat(filled)}
        <span className="text-text/20">{'★'.repeat(MAX_RATING - filled)}</span>
      </span>
      <span className="sr-only">{t('community.review.ratingLabel', { rating })}</span>
    </span>
  );
}
