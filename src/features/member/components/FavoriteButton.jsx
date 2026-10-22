import { useTranslation } from 'react-i18next';
import { useFavoriteStore } from '../hooks/useFavoriteStore';

// 찜 켜고 끄기 (43). 상태는 aria-pressed로 알리고, 이름에 장소 이름을 넣어 목록에서도 어느 장소인지 구분되게 한다.
// 손가락으로 누르기 편하게 44px로 둔다.
export default function FavoriteButton({ place, className = '' }) {
  const { t } = useTranslation();
  const isFavorite = useFavoriteStore((state) => state.ids.includes(place.id));
  const toggle = useFavoriteStore((state) => state.toggle);

  return (
    <button
      type="button"
      aria-pressed={isFavorite}
      aria-label={t('favorite.toggle', { name: place.name })}
      onClick={() => toggle(place.id)}
      className={`grid size-11 shrink-0 place-items-center rounded-full text-subtitle transition-colors hover:bg-bg-soft focus-visible:outline-2 focus-visible:outline-primary ${isFavorite ? 'text-point' : 'text-text/60'} ${className}`}
    >
      <span aria-hidden="true">{isFavorite ? '♥' : '♡'}</span>
    </button>
  );
}
