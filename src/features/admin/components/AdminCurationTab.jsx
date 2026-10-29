import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Chip from '../../../components/common/Chip';
import EmptyState from '../../../components/common/EmptyState';
import ErrorState from '../../../components/common/ErrorState';
import Loading from '../../../components/common/Loading';
import { getAllCurationItems } from '../../../pages/Home/curation/curationList';
import GoogleAttribution from '../../search/components/GoogleAttribution';
import { useAdminActions } from '../hooks/useAdminActions';
import { useAdminStore } from '../hooks/useAdminStore';
import { useCurationCandidates } from '../hooks/useCurationCandidates';

// 관리 화면 「추천 장소」 탭: 홈 테마·시즌 추천(81·82)에 나오는 장소를 숨긴다.
// 테마는 숨긴 자리를 다음 장소가 채우고, 시즌은 정해 둔 4곳이라 숨기면 그만큼 줄어든다.
// 장소 검색·상세에서는 그대로 보인다 — 여기서 고르는 건 「추천」 목록뿐이다.
export default function AdminCurationTab() {
  const { t } = useTranslation();
  const [items] = useState(getAllCurationItems);
  const [selectedKey, setSelectedKey] = useState(items[0].key);
  const selected = items.find((item) => item.key === selectedKey);
  const { places, isPending, isError, refetch } = useCurationCandidates(selected);
  const hiddenIds = useAdminStore((state) => state.hiddenPlaceIds);
  const { toggleHiddenPlace } = useAdminActions();

  const itemLabel = (item) =>
    item.type === 'season'
      ? t(`admin.curation.season.${item.key}`)
      : t(`home.curation.theme.${item.key}.chip`);

  const renderPlaces = () => {
    if (isPending) return <Loading />;
    if (isError) return <ErrorState onRetry={refetch} />;
    if (places.length === 0) return <EmptyState title={t('home.curation.empty')} />;
    return (
      <>
        <ul className="flex flex-col gap-2">
          {places.map((place) => {
            const hidden = hiddenIds.includes(place.id);
            return (
              <li
                key={place.id}
                className={`flex items-center gap-3 rounded-xl border border-text/10 bg-background p-3 ${hidden ? 'opacity-60' : ''}`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-bold break-keep">{place.name}</span>
                  <span className="text-body-sm text-text/70">
                    {t(`common.category.${place.category}`)}
                  </span>
                </span>
                <Chip
                  label={t('admin.product.hide')}
                  selected={hidden}
                  onClick={() => toggleHiddenPlace(place.id)}
                  aria-label={t('admin.product.hideLabel', { title: place.name })}
                />
              </li>
            );
          })}
        </ul>
        {places.some((place) => place.source === 'google') && <GoogleAttribution />}
      </>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label={t('admin.curation.label')} className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Chip
            key={item.key}
            label={itemLabel(item)}
            selected={item.key === selectedKey}
            onClick={() => setSelectedKey(item.key)}
          />
        ))}
      </div>
      <p className="text-body-sm text-text/70 break-keep">
        {t(`admin.curation.${selected.type}Hint`, { city: t(`common.city.${selected.city}`) })}
      </p>
      {renderPlaces()}
    </div>
  );
}
