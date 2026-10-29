import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { MAX_MEMO_LENGTH, MAX_STAY_MINUTES, MIN_STAY_MINUTES } from '../constants';
import { validateItemForm } from '../utils/validateItem';
import TimeSelect from './TimeSelect';

// 장소 한 곳의 방문 시간·체류 시간·메모를 고치는 폼 (17).
// 저장을 눌렀을 때만 검사하고, 통과하면 onSave({ startTime, stayMinutes, memo })를 부른다.
export default function ItemEditForm({ item, onSave, onCancel }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    startTime: item.startTime,
    stayMinutes: String(item.stayMinutes),
    memo: item.memo,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateItemForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSave({
      startTime: form.startTime,
      stayMinutes: Number(form.stayMinutes),
      memo: form.memo.trim(),
    });
  };

  const getError = (field) =>
    errors[field] ? t(errors[field], { min: MIN_STAY_MINUTES, max: MAX_STAY_MINUTES }) : undefined;

  return (
    <form data-item-edit-form onSubmit={handleSubmit} noValidate className="mt-3 space-y-3">
      <TimeSelect
        label={t('planner.edit.startTime')}
        value={form.startTime}
        onChange={(startTime) => setForm((prev) => ({ ...prev, startTime }))}
        error={getError('startTime')}
      />
      <Input
        label={t('planner.edit.stayMinutes')}
        type="number"
        inputMode="numeric"
        min={MIN_STAY_MINUTES}
        max={MAX_STAY_MINUTES}
        step={5}
        value={form.stayMinutes}
        onChange={handleChange('stayMinutes')}
        error={getError('stayMinutes')}
      />
      <Input
        label={t('planner.edit.memo')}
        placeholder={t('planner.edit.memoPlaceholder')}
        maxLength={MAX_MEMO_LENGTH}
        value={form.memo}
        onChange={handleChange('memo')}
      />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>
          {t('planner.edit.cancel')}
        </Button>
        <Button type="submit">{t('planner.edit.save')}</Button>
      </div>
    </form>
  );
}
