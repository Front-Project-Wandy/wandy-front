import { useId } from 'react';

// label·error가 있으면 입력창과 id로 묶어서, 라벨을 눌러도 입력창에 커서가 가고
// 화면 낭독기가 에러 문구까지 같이 읽게 한다.
// onChange는 기본 input과 똑같이 이벤트를 넘긴다 (값은 event.target.value).
// 칸 여러 개가 에러 문구 하나를 같이 쓸 때(가는 날·오는 날)는 error 대신
// aria-invalid·aria-describedby를 직접 넘기면 되고, 그 값도 빨간 테두리·연결에 반영된다.
export default function Input({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = 'text',
  className = '',
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
  ...rest
}) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  // aria-invalid는 불리언(true)뿐 아니라 HTML처럼 글자('true', 'grammar', 'spelling')로도 올 수 있어서,
  // 값이 없거나 false·'false'일 때만 정상으로 본다.
  const isInvalid =
    Boolean(error) || (ariaInvalid != null && ariaInvalid !== false && ariaInvalid !== 'false');
  const describedBy = [ariaDescribedBy, error && errorId].filter(Boolean).join(' ') || undefined;

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
        aria-invalid={isInvalid}
        aria-describedby={describedBy}
        className={`h-11 rounded-xl border bg-background px-4 text-body outline-none transition-colors placeholder:text-text/40 focus:ring-2 disabled:bg-bg-soft disabled:text-text/50 ${
          isInvalid
            ? 'border-error focus:ring-error/20'
            : 'border-text/20 focus:border-primary focus:ring-primary/20'
        }`}
      />
      {/* role="alert": 제출 순간 새로 나타난 에러를 화면 낭독기가 바로 읽는다 */}
      {error && (
        <p id={errorId} role="alert" className="text-body-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
