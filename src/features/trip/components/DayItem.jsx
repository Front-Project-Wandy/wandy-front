import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import OpeningHoursWarning from '../../search/components/OpeningHoursWarning';
import { useItemName } from '../hooks/useItemName';
import DragHandle from './DragHandle';
import ItemEditForm from './ItemEditForm';
import LocalNameDialog from './LocalNameDialog';
import NumberBadge from './NumberBadge';

// DAY 목록의 장소 한 줄. 구글 장소는 약관 때문에 이름을 저장하지 않아서(name: null)
// placeId로 다시 불러와 보여준다. 네이버·TourAPI 장소는 저장된 이름을 바로 쓴다.
// isTimeOutOfOrder: 앞 장소보다 시작 시간이 빠를 때 알려 주기만 하고 순서는 바꾸지 않는다.
// flightWarnings: 비행기 도착·출발 시각과 어긋날 때의 경고 목록 (이것도 알려 주기만 한다).
// isSelected·onSelect: 지도 마커와 연동된 선택 상태 (15). 지도에서 고르면 이 카드가 화면에 보이게 한다.
// 번호 원은 지도 마커와 같은 모양(흰 원 + DAY 색 테두리 + 어두운 숫자)이라 dayIndex를 받는다.
// dragHandleProps: 끌어서 순서를 바꾸는 손잡이에 줄 값 (16). 없으면 손잡이를 그리지 않는다.
export default function DayItem({
  item,
  number,
  dayIndex,
  date,
  isTimeOutOfOrder,
  flightWarnings = [],
  isSelected = false,
  dragHandleProps,
  onSelect,
  onUpdate,
  onRemove,
}) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  // 현지어 이름·주소 창이 열려 있는지 (94). 일본(구글) 장소만 있다. 한국은 화면 글자가 곧 현지어다.
  const [isShowingLocal, setIsShowingLocal] = useState(false);
  const editButtonRef = useRef(null);
  const itemRef = useRef(null);
  const detailsId = useId();
  // 폼이 닫히면 편집 버튼이 새로 그려져서, 키보드 포커스를 그 버튼으로 돌려줘야 한다
  const shouldRestoreFocus = useRef(false);
  const name = useItemName(item);

  useEffect(() => {
    if (isEditing || !shouldRestoreFocus.current) return;
    shouldRestoreFocus.current = false;
    editButtonRef.current?.focus();
  }, [isEditing]);

  // 지도에서 마커를 눌렀을 때 목록에서 그 장소를 찾을 수 있게 보이는 곳으로 가져온다.
  // 이미 보이면 움직이지 않고, 움직임을 줄여 달라고 한 사용자에게는 부드럽게 스크롤하지 않는다.
  useEffect(() => {
    if (!isSelected) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    itemRef.current?.scrollIntoView({
      block: 'nearest',
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [isSelected]);

  const handleOpenEdit = () => setIsEditing(true);
  const handleCloseEdit = () => {
    shouldRestoreFocus.current = true;
    setIsEditing(false);
  };
  const handleSave = (patch) => {
    onUpdate(item.id, patch);
    handleCloseEdit();
  };
  const handleRemove = () => onRemove(item.id);
  const handleSelect = () => onSelect?.(item.id);

  return (
    <div
      ref={itemRef}
      className={`rounded-2xl border p-3 ${isSelected ? 'border-primary bg-bg-soft' : 'border-text/10 bg-background'}`}
    >
      {/* flex-wrap·min-w-40: 현지어·편집·삭제 버튼이 이름 칸을 한두 글자로 줄이지 않게, 모자라면 버튼이 아래 줄로 내려간다 */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {dragHandleProps ? (
          <DragHandle label={t('planner.drag.handle', { name })} {...dragHandleProps} />
        ) : null}
        {/* 누르면 지도에서 이 장소를 보여 준다. 편집·삭제 버튼과 겹치지 않게 왼쪽 영역만 버튼이다.
            버튼 이름은 이름·시간만 두고, 경고·메모는 aria-describedby로 이어서 낭독기가 길게 읽지 않게 한다 */}
        <button
          type="button"
          aria-pressed={isSelected}
          aria-describedby={detailsId}
          onClick={handleSelect}
          className="flex min-w-40 flex-1 items-center gap-3 rounded-xl text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <NumberBadge number={number} dayIndex={dayIndex} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-body font-bold">{name}</span>
            <span className="block text-body-sm text-text/70">
              {item.startTime} · {t('planner.item.stay', { minutes: item.stayMinutes })}
            </span>
          </span>
        </button>
        {/* 화면에는 "편집"·"삭제"만 보여서, 낭독기가 어느 장소인지 알 수 있게 이름을 붙인다 */}
        {isEditing ? null : (
          <span className="ml-auto flex shrink-0 items-center">
            {item.source === 'google' ? (
              <Button
                variant="ghost"
                aria-label={t('planner.local.buttonLabel', { name })}
                onClick={() => setIsShowingLocal(true)}
              >
                {t('planner.local.button')}
              </Button>
            ) : null}
            <Button
              ref={editButtonRef}
              variant="ghost"
              aria-label={t('planner.item.editLabel', { name })}
              onClick={handleOpenEdit}
            >
              {t('planner.item.edit')}
            </Button>
            <Button
              variant="ghost"
              aria-label={t('planner.item.removeLabel', { name })}
              onClick={handleRemove}
            >
              {t('planner.item.remove')}
            </Button>
          </span>
        )}
      </div>
      {/* 경고·메모가 하나도 없으면 비어서 :empty로 숨겨진다 (영업시간 경고는 불러온 뒤에야 생길 수 있다) */}
      <div id={detailsId} className={`pt-1 empty:hidden ${dragHandleProps ? 'pl-21' : 'pl-11'}`}>
        {isTimeOutOfOrder ? (
          <span className="block text-body-sm font-bold text-text">
            {t('planner.item.timeOrderWarning')}
          </span>
        ) : null}
        {flightWarnings.map(({ type, time }) => (
          <span key={type} className="block text-body-sm font-bold text-text">
            {t(`planner.item.${type}Warning`, { time })}
          </span>
        ))}
        <OpeningHoursWarning
          placeId={item.placeId}
          date={date}
          startTime={item.startTime}
          stayMinutes={item.stayMinutes}
        />
        {item.memo ? (
          <span className="block break-words text-body-sm text-text/70">{item.memo}</span>
        ) : null}
      </div>
      {isEditing ? (
        // 폼은 열 때의 값을 들고 있어서, 되돌리기·다시 실행으로 이 장소의 값이 바뀌면 새로 그려 옛 값으로 덮어쓰지 않게 한다.
        <ItemEditForm
          key={`${item.startTime}|${item.stayMinutes}|${item.memo}`}
          item={item}
          onSave={handleSave}
          onCancel={handleCloseEdit}
        />
      ) : null}
      {item.source === 'google' ? (
        <LocalNameDialog
          open={isShowingLocal}
          onClose={() => setIsShowingLocal(false)}
          placeId={item.placeId}
          displayName={name}
        />
      ) : null}
    </div>
  );
}
