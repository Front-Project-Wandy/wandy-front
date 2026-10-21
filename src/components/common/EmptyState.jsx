// 보여줄 데이터가 없을 때의 화면 (와이어프레임 Q01 "빈 화면").
// action에는 다음 행동 버튼을 넣는다 (예: <Button>장소 추가하기</Button>).
// 빈 화면이 막다른 길이 되지 않도록 무엇을 하면 되는지 같이 보여주는 것이 목적이다.
export default function EmptyState({ title, description, action, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 px-4 py-12 text-center ${className}`}
    >
      <p className="text-subtitle font-bold">{title}</p>
      {description && <p className="text-body-sm text-text/70">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
