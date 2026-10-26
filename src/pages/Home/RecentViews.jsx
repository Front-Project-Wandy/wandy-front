import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import GoogleAttribution from '../../features/search/components/GoogleAttribution';
import { useRecentStore } from '../../store/recent/useRecentStore';
import { useRecentItems } from './useRecentItems';

// 와이어프레임 H01은 한 줄에 4개라 4개까지만 보여준다 (기록은 8개까지 남긴다).
const SHOW_LIMIT = 4;

// 홈 "최근 본 장소와 상품" (83, 여유). 본 게 없으면 섹션을 그리지 않는다.
// 장소·상품 상세를 본 기록은 AppLayout이 남기고(useTrackRecentView), 여기서는 다시 불러와 보여주기만 한다.
export default function RecentViews() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const clear = useRecentStore((state) => state.clear);
  const { count, isPending, entries } = useRecentItems(SHOW_LIMIT);

  if (count === 0) return null;

  const toCardContent = ({ type, data }) =>
    type === 'place'
      ? {
          name: data.name,
          detail: `${t(`common.category.${data.category}`)} · ${t(`common.city.${data.city}`)}`,
          path: `/place/${encodeURIComponent(data.id)}`,
        }
      : {
          name: data.title,
          detail: t(`common.city.${data.city}`),
          path: `/products?id=${encodeURIComponent(data.id)}`,
        };

  return (
    <section aria-labelledby="recent-views-title" className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 id="recent-views-title" className="text-subtitle font-bold">
          {t('home.recent.title')}
        </h2>
        <Button variant="ghost" size="sm" onClick={clear}>
          {t('home.recent.clear')}
        </Button>
      </div>

      {isPending && entries.length === 0 ? (
        <Loading />
      ) : (
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {entries.map((entry) => {
            const { name, detail, path } = toCardContent(entry);
            return (
              <li key={`${entry.type}:${entry.id}`}>
                <Card onClick={() => navigate(path)} className="h-full">
                  <div className="flex h-full flex-col gap-1 p-3">
                    <span className="text-caption font-bold text-primary">
                      {t(`home.recent.type.${entry.type}`)}
                    </span>
                    <span className="line-clamp-2 text-body-sm font-bold break-keep">{name}</span>
                    <span className="text-caption text-text/70">{detail}</span>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
      {entries.some((entry) => entry.type === 'place' && entry.data.source === 'google') && (
        <GoogleAttribution />
      )}
    </section>
  );
}
