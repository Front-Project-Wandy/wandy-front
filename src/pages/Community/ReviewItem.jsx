import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/common/Button';
import RatingStars from './RatingStars';
import ReviewForm from './ReviewForm';

// 후기 한 개 (105). 내 후기만 고치기·지우기를 보여 준다.
// 지우기는 되돌릴 수 없어서 한 번 더 묻는다 (같은 자리에서 「정말 지울까요?」로 바뀜).
export default function ReviewItem({ review, onUpdate, onRemove }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState('view');

  if (mode === 'edit') {
    return (
      <li>
        <ReviewForm
          initial={review}
          onCancel={() => setMode('view')}
          onSubmit={(values) => {
            onUpdate(review.id, values);
            setMode('view');
          }}
        />
      </li>
    );
  }

  return (
    <li className="flex flex-col gap-2 border-b border-text/10 py-4 last:border-b-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-body-sm font-bold">{review.author}</span>
        {review.isMine ? (
          <span className="rounded-full bg-apricot-soft px-2 py-0.5 text-caption font-bold text-apricot-ink">
            {t('community.review.mine')}
          </span>
        ) : null}
        <RatingStars rating={review.rating} />
        <span className="text-caption text-text/60">
          {review.updatedAt
            ? t('community.review.edited', { date: review.updatedAt })
            : review.createdAt}
        </span>
      </div>
      <p className="text-body-sm whitespace-pre-line text-text/80">{review.text}</p>
      {review.isMine ? (
        <div className="flex flex-wrap items-center gap-2">
          {mode === 'confirmRemove' ? (
            <>
              <span className="text-caption font-bold text-error">
                {t('community.review.confirmRemove')}
              </span>
              <Button variant="secondary" size="sm" onClick={() => onRemove(review.id)}>
                {t('community.review.remove')}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setMode('view')}>
                {t('community.review.cancel')}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => setMode('edit')}>
                {t('community.review.edit')}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setMode('confirmRemove')}>
                {t('community.review.remove')}
              </Button>
            </>
          )}
        </div>
      ) : null}
    </li>
  );
}
