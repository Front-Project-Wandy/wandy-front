import { useId } from 'react';

// 마법사의 "여러 개 중 하나 고르기" 카드 묶음 (STEP2 항공 예약 여부, STEP4 교통 방식).
// 진짜 라디오 버튼을 카드 모양으로 꾸며서, ↑/↓ 키 이동과 "n개 중 m번째, 선택됨" 읽기는 브라우저가 해 준다.
// options = [{ value, title, description }], 고른 값은 부모가 value로 정하고 onChange(value)로 알린다.
export default function RadioCardGroup({ legend, options, value, onChange, error }) {
  const groupName = useId();
  const errorId = `${groupName}-error`;

  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="text-body font-bold">{legend}</legend>
      <div className="mt-3 flex flex-col gap-3">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${
                isSelected ? 'border-primary bg-bg-soft' : 'border-text/20 hover:bg-bg-soft'
              }`}
            >
              <input
                type="radio"
                name={groupName}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="mt-1 size-4 shrink-0 accent-primary"
              />
              <span className="flex flex-col gap-0.5 break-keep">
                <span className="text-body font-bold">{option.title}</span>
                {option.description && (
                  <span className="text-body-sm text-text/70">{option.description}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-body-sm text-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}
