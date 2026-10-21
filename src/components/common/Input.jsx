import { useId } from 'react';

// label·error가 있으면 입력창과 id로 묶어서, 라벨을 눌러도 입력창에 커서가 가고
// 화면 낭독기가 에러 문구까지 같이 읽게 한다.
// onChange는 기본 input과 똑같이 이벤트를 넘긴다 (값은 event.target.value).
export default function Input({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = 'text',
  className = '',
  ...rest
}) {
  const inputId = useId();
  const errorId = `${inputId}-error`;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-body-sm font-bold">
          {label}
        </label>
      )}
      <input
        {...rest}
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`h-11 rounded-xl border bg-background px-4 text-body outline-none transition-colors placeholder:text-text/40 focus:ring-2 disabled:bg-bg-soft disabled:text-text/50 ${
          error
            ? 'border-error focus:ring-error/20'
            : 'border-text/20 focus:border-primary focus:ring-primary/20'
        }`}
      />
      {error && (
        <p id={errorId} className="text-body-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
