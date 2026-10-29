import { useTranslation } from 'react-i18next';
import Chip from '../../../components/common/Chip';

const MODES = ['list', 'timeline', 'today'];

// 플래너 일정을 목록·타임라인·오늘 일정(93) 중 어느 방식으로 볼지 고르는 칩 (80).
export default function ViewToggle({ value, onChange }) {
  const { t } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t('planner.view.label')}
      className="flex flex-wrap items-center gap-2"
    >
      {MODES.map((mode) => (
        <Chip
          key={mode}
          label={t(`planner.view.${mode}`)}
          selected={value === mode}
          onClick={() => onChange(mode)}
        />
      ))}
    </div>
  );
}
