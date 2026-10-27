import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import EmptyState from '../../../components/common/EmptyState';
import ErrorState from '../../../components/common/ErrorState';
import Loading from '../../../components/common/Loading';
import Modal from '../../../components/common/Modal';
import { useFillItinerary } from '../hooks/useFillItinerary';
import { hasEmptyDay } from '../utils/buildFillConditions';
import AiFillPreview from './AiFillPreview';

// AI 빈 일정 채우기 창 (55 플래너, 54 마법사). [일정 만들기] → 미리보기 → [일정에 넣기]면 onApply(days)로 결과만 넘긴다.
// conditions: buildFillConditions(플래너) 또는 buildWizardFillConditions(마법사)로 만든 요청 조건.
// 결과를 어디에 넣을지(플랜 store, 마법사 spots)는 부르는 쪽이 정한다.
// 열 때마다 처음부터 시작하도록, 부르는 쪽(AiFillButton)이 열려 있을 때만 그린다.
// 「비 오는 날이에요」를 켜면 실내 장소 위주로 만든다 (79). 결과를 본 뒤 바꾸고 [다시 만들기]를 눌러도 된다.
export default function AiFillDialog({ conditions, onApply, onClose }) {
  const { t } = useTranslation();
  const rainyHintId = useId();
  const { mutate, data, isPending, isError } = useFillItinerary();
  const [rainy, setRainy] = useState(false);

  const handleGenerate = () => mutate({ ...conditions, rainy });

  const rainyOption = (
    <label className="flex items-start gap-2 text-body-sm">
      <input
        type="checkbox"
        checked={rainy}
        onChange={(event) => setRainy(event.target.checked)}
        aria-describedby={rainyHintId}
        className="mt-0.5 size-4 shrink-0 accent-primary"
      />
      <span className="flex flex-col gap-0.5">
        <span className="font-bold">{t('ai.fill.rainy')}</span>
        <span id={rainyHintId} className="text-text/70 break-keep">
          {t('ai.fill.rainyHint')}
        </span>
      </span>
    </label>
  );
  const handleApply = () => {
    onApply(data.days);
    onClose();
  };

  const renderBody = () => {
    if (!hasEmptyDay(conditions))
      return (
        <EmptyState
          title={t('ai.fill.noEmptyDaysTitle')}
          description={t('ai.fill.noEmptyDaysDescription')}
        />
      );
    if (isPending) return <Loading />;
    if (isError) return <ErrorState onRetry={handleGenerate} />;
    if (!data)
      return (
        <div className="space-y-4">
          <p className="text-body text-text/70 break-keep">{t('ai.fill.description')}</p>
          {rainyOption}
          <Button className="w-full" onClick={handleGenerate}>
            {t('ai.fill.generate')}
          </Button>
        </div>
      );
    if (data.days.length === 0)
      return (
        <EmptyState
          title={t('ai.fill.emptyResultTitle')}
          description={t('ai.fill.emptyResultDescription')}
        />
      );
    // 미리보기만 스크롤하고 버튼은 밖에 둔다. 모바일에서 목록을 끝까지 내려야 버튼이 보이지 않게.
    return (
      <div className="space-y-4">
        <div className="max-h-80 space-y-4 overflow-y-auto pr-2">
          <AiFillPreview days={data.days} />
          {data.droppedCount > 0 ? (
            <p className="text-body-sm text-text/70">
              {t('ai.fill.dropped', { count: data.droppedCount })}
            </p>
          ) : null}
          <p className="text-caption text-text/70">{t('ai.fill.mockNotice')}</p>
        </div>
        {rainyOption}
        <div className="flex flex-col gap-2 sm:flex-row-reverse">
          <Button className="sm:flex-1" onClick={handleApply}>
            {t('ai.fill.apply')}
          </Button>
          <Button variant="secondary" className="sm:flex-1" onClick={handleGenerate}>
            {t('ai.fill.regenerate')}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal open onClose={onClose} title={t('ai.fill.title')}>
      {renderBody()}
    </Modal>
  );
}
