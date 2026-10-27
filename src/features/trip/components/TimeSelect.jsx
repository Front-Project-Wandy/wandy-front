import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { HOUR_OPTIONS, getMinuteOptions, splitTime } from '../utils/timeOptions';

const SELECT_CLASS =
  'h-11 flex-1 rounded-xl border bg-background px-3 text-body outline-none transition-colors focus:ring-2';

// 24시간제 시·분 선택 (value는 'HH:mm'). 브라우저 기본 시간 입력은 오전/오후로 보여서 대신 쓴다.
// 시나 분 중 하나만 골라도 다른 쪽이 비어 있으면 00으로 채워서 항상 'HH:mm'이 되게 한다.
export default function TimeSelect({ label, value, onChange, error }) {
  const { t } = useTranslation();
  const errorId = useId();
  const { hour, minute } = splitTime(value);
  const borderClass = error
    ? 'border-error focus:ring-error/20'
    : 'border-text/20 focus:border-primary focus:ring-primary/20';

  const handleHourChange = (event) => onChange(`${event.target.value}:${minute || '00'}`);
  const handleMinuteChange = (event) => onChange(`${hour || '00'}:${event.target.value}`);

  return (
    <fieldset className="flex flex-col gap-1">
      <legend className="mb-1 text-body-sm font-bold">{label}</legend>
      <div className="flex gap-2">
        <select
          aria-label={t('planner.edit.hour')}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          value={hour}
          onChange={handleHourChange}
          className={`${SELECT_CLASS} ${borderClass}`}
        >
          {hour === '' && <option value="">--</option>}
          {HOUR_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {t('planner.edit.hourOption', { value: option })}
            </option>
          ))}
        </select>
        <select
          aria-label={t('planner.edit.minute')}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          value={minute}
          onChange={handleMinuteChange}
          className={`${SELECT_CLASS} ${borderClass}`}
        >
          {minute === '' && <option value="">--</option>}
          {getMinuteOptions(minute).map((option) => (
            <option key={option} value={option}>
              {t('planner.edit.minuteOption', { value: option })}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-body-sm text-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}
