import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { useWizardStore } from '../../store/wizard/wizardStore';
import BasicInfoFields from '../Wizard/BasicInfoFields';
import { clearFieldErrors, validateBasicInfo } from '../Wizard/validateBasicInfo';

const INITIAL_VALUES = { country: null, city: null, startDate: '', endDate: '', people: '2' };

// 홈 "내 여행 만들기" 카드 (23). 나라·도시·날짜·인원을 받아 마법사로 넘긴다.
// 입력 중에는 이 컴포넌트 안(useState)에만 두고, [플래너 시작]을 눌러 검사를 통과하면 wizardStore에 저장한다.
// (마법사 STEP1은 반대로 입력할 때마다 바로 저장한다 — 중간 저장)
export default function TripStartForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const startDraft = useWizardStore((state) => state.startDraft);
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});

  const handleChange = (patch) => {
    setValues((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => clearFieldErrors(prev, patch));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateBasicInfo(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    startDraft({ ...values, people: Number(values.people) });
    navigate('/plan/new');
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h2 className="text-subtitle font-bold">{t('home.start.title')}</h2>
      <BasicInfoFields values={values} errors={errors} onChange={handleChange} />
      <Button type="submit" size="lg" className="w-full">
        {t('home.start.submit')}
      </Button>
    </form>
  );
}
