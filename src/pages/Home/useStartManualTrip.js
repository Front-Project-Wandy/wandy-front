import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { usePreferenceStore } from '../../features/member/hooks/usePreferenceStore';
import { startManualTrip } from './startManualTrip';

// 홈 [직접 짤게요]: 마법사 없이 바로 빈 플래너를 열어 주는 함수를 돌려준다 (53).
export function useStartManualTrip() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const preferences = usePreferenceStore((state) => state.preferences);

  return (values) => {
    const title = t('wizard.summary.defaultTitle', { city: t(`common.city.${values.city}`) });
    navigate(`/trip/${startManualTrip({ values, preferences, title })}`);
  };
}
