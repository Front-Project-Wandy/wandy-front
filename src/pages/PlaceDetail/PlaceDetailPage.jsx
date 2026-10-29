import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Loading from '../../components/common/Loading';
import PlaceProductSection from '../../features/product/components/PlaceProductSection';
import NearbyRestaurants from '../../features/restaurant/components/NearbyRestaurants';
import NearbyAmenities from '../../features/search/components/NearbyAmenities';
import { usePlace } from '../../features/search/hooks/usePlace';
import { getPlacePath } from '../../features/search/place';
import PlaceHero from './PlaceHero';
import PlaceInfo from './PlaceInfo';
import WandyReviewSection from './WandyReviewSection';

// /place/:id — 장소 상세 (10·11)와 주변 식당 (22), Wandy 여행자 평점 (74), 어울리는 투어 상품 (84).
// 큰 히어로 아래로 섹션마다 큰 제목과 넉넉한 간격을 둔다. lg에서는 이용 정보·혼잡도와 주변 맛집을 좌우로 놓는다.
export default function PlaceDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: place, isPending, isError, error, refetch } = usePlace(id);

  // 상세에서 주변 맛집을 눌러 다른 장소로 가면 이미 받아 둔 데이터로 바로 그려져서 스크롤이 남는다 — 맨 위로 올린다.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // 주소로 바로 들어와서 뒤로 갈 곳이 없으면 홈으로 보낸다.
  const handleBack = () => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate('/');
  };
  const handleSelectPlace = (next) => navigate(getPlacePath(next));

  const renderBody = () => {
    if (isPending) return <Loading />;
    if (isError && error.message === 'PLACE_NOT_FOUND')
      return (
        <EmptyState
          title={t('place.error.notFound')}
          description={t('place.error.notFoundDescription')}
        />
      );
    if (isError) return <ErrorState onRetry={() => refetch()} />;
    return (
      <div className="space-y-14 lg:space-y-20">
        <PlaceHero place={place} />
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-12">
          <PlaceInfo place={place} />
          <NearbyRestaurants key={place.id} place={place} onSelectPlace={handleSelectPlace} />
        </div>
        <WandyReviewSection place={place} />
        <NearbyAmenities key={place.id} place={place} />
        <PlaceProductSection place={place} />
      </div>
    );
  };

  return (
    <main className="mx-auto max-w-5xl space-y-4 px-4 py-4 lg:px-6 lg:py-8">
      <button
        type="button"
        onClick={handleBack}
        className="-ml-2 h-11 rounded-xl px-2 text-body-sm font-bold text-link"
      >
        <span aria-hidden="true">‹ </span>
        {t('common.action.back')}
      </button>
      {renderBody()}
    </main>
  );
}
