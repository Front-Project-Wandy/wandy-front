import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import { usePlace } from '../../search/hooks/usePlace';
import ItemEditForm from './ItemEditForm';

// DAY 목록의 장소 한 줄. 구글 장소는 약관 때문에 이름을 저장하지 않아서(name: null)
// placeId로 다시 불러와 보여준다. 네이버·TourAPI 장소는 저장된 이름을 바로 쓴다.
export default function DayItem({ item, number, onUpdate }) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const needsLookup = item.name === null;
  // id가 없으면 usePlace가 요청을 보내지 않는다
  const { data: place, isPending, isError } = usePlace(needsLookup ? item.placeId : null);

  const renderName = () => {
    if (!needsLookup) return item.name;
    if (isPending) return t('planner.item.nameLoading');
    if (isError) return t('planner.item.nameError');
    return place.name;
  };

  const name = renderName();
  const handleOpenEdit = () => setIsEditing(true);
  const handleCloseEdit = () => setIsEditing(false);
  const handleSave = (patch) => {
    onUpdate(item.id, patch);
    setIsEditing(false);
  };

  return (
    <li className="rounded-2xl border border-text/10 bg-background p-3">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-body font-bold text-white"
        >
          {number}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-body font-bold">{name}</span>
          <span className="block text-body-sm text-text/70">
            {item.startTime} · {t('planner.item.stay', { minutes: item.stayMinutes })}
          </span>
          {item.memo ? (
            <span className="block break-words text-body-sm text-text/70">{item.memo}</span>
          ) : null}
        </span>
        {/* 화면에는 "편집"만 보여서, 낭독기가 어느 장소인지 알 수 있게 이름을 붙인다 */}
        {isEditing ? null : (
          <Button
            variant="ghost"
            aria-label={t('planner.item.editLabel', { name })}
            onClick={handleOpenEdit}
          >
            {t('planner.item.edit')}
          </Button>
        )}
      </div>
      {isEditing ? (
        <ItemEditForm item={item} onSave={handleSave} onCancel={handleCloseEdit} />
      ) : null}
    </li>
  );
}
