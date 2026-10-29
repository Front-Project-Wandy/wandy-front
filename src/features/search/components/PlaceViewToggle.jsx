import { useTranslation } from 'react-i18next';

const VIEWS = ['list', 'map'];

// 장소 탐색 [목록 | 지도] 전환 (74). 둘 중 하나만 켜지는 버튼이라 aria-pressed로 지금 보기를 알린다.
export default function PlaceViewToggle({ value, onChange }) {
  const { t } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t('places.mapView.toggleLabel')}
      className="inline-flex shrink-0 rounded-full border border-text/15 bg-background p-1"
    >
      {VIEWS.map((view) => (
        <button
          key={view}
          type="button"
          aria-pressed={value === view}
          onClick={() => onChange(view)}
          className={`h-8 rounded-full px-4 text-body-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
            value === view ? 'bg-brand text-ink' : 'text-text/70 hover:bg-bg-soft'
          }`}
        >
          {t(`places.mapView.view.${view}`)}
        </button>
      ))}
    </div>
  );
}
