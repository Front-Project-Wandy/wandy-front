import { useTranslation } from 'react-i18next';
import { useDescribePlace } from '../hooks/useDescribePlace';

// 장소 상세 이름 아래의 AI 한 줄 설명 (78).
// 없어도 되는 보조 정보라 상세 화면을 막지 않는다 — 만드는 동안은 자리만 두고, 실패하면 그리지 않는다.
export default function AiPlaceDescription({ place }) {
  const { t } = useTranslation();
  const { data, isPending, isError } = useDescribePlace(place);

  if (isError) return null;
  // 글자가 들어와도 아래 내용이 밀리지 않게 설명 두 줄(본문+표시) 높이만큼 자리를 둔다.
  if (isPending)
    return <div aria-hidden="true" className="h-11 w-full animate-pulse rounded-xl bg-bg-soft" />;

  return (
    <div className="space-y-1">
      <p className="text-body">{data.description}</p>
      <p className="text-caption text-text/70">{t('ai.placeDescription.badge')}</p>
    </div>
  );
}
