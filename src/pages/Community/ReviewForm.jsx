import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/common/Button';
import { MAX_RATING, REVIEW_MAX_LENGTH } from './reviewUtils';

const RATINGS = Array.from({ length: MAX_RATING }, (_, index) => index + 1);

// 후기 쓰기·고치기 폼 (105). initial이 있으면 고치기다.
// 별점은 라디오 버튼 묶음이라 키보드 ←/→로도 고를 수 있다. 글은 공백만 쓰면 저장하지 않는다.
export default function ReviewForm({ initial = null, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const textId = useId();
  const errorId = useId();
  const [rating, setRating] = useState(initial?.rating ?? MAX_RATING);
  const [text, setText] = useState(initial?.text ?? '');
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      setHasError(true);
      return;
    }
    onSubmit({ rating, text: trimmed });
    // 새 후기를 남긴 뒤에는 다음 후기를 쓸 수 있게 비운다 (고치기는 폼이 닫혀서 비울 필요가 없다).
    if (!initial) {
      setRating(MAX_RATING);
      setText('');
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl bg-bg-soft p-4"
    >
      <fieldset className="flex flex-wrap items-center gap-2">
        <legend className="mb-1 text-body-sm font-bold">
          {t('community.review.ratingLegend')}
        </legend>
        {RATINGS.map((value) => (
          <label
            key={value}
            className="cursor-pointer rounded-full text-title leading-none has-focus-visible:outline-2 has-focus-visible:outline-primary"
          >
            <input
              type="radio"
              name={`${textId}-rating`}
              value={value}
              checked={rating === value}
              onChange={() => setRating(value)}
              className="sr-only"
            />
            <span aria-hidden="true" className={value <= rating ? 'text-point' : 'text-text/20'}>
              ★
            </span>
            <span className="sr-only">{t('community.review.ratingLabel', { rating: value })}</span>
          </label>
        ))}
      </fieldset>
      <label htmlFor={textId} className="text-body-sm font-bold">
        {t('community.review.textLabel')}
      </label>
      <textarea
        id={textId}
        value={text}
        maxLength={REVIEW_MAX_LENGTH}
        rows={3}
        placeholder={t('community.review.placeholder')}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        onChange={(event) => {
          setText(event.target.value);
          setHasError(false);
        }}
        className={`w-full resize-none rounded-xl border bg-background px-4 py-3 text-body focus-visible:outline-2 focus-visible:outline-primary ${hasError ? 'border-error' : 'border-text/20'}`}
      />
      <div className="flex items-center justify-between gap-2">
        {hasError ? (
          <p id={errorId} className="text-caption text-error">
            {t('community.review.error')}
          </p>
        ) : (
          <p className="text-caption text-text/60">
            {t('community.review.length', { count: text.length, max: REVIEW_MAX_LENGTH })}
          </p>
        )}
        <div className="flex gap-2">
          {onCancel ? (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              {t('community.review.cancel')}
            </Button>
          ) : null}
          <Button type="submit" size="sm">
            {initial ? t('community.review.save') : t('community.review.submit')}
          </Button>
        </div>
      </div>
    </form>
  );
}
