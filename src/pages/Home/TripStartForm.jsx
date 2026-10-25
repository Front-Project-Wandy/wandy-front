import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/common/Button';
import BasicInfoFields from '../Wizard/BasicInfoFields';
import { clearFieldErrors, validateBasicInfo } from '../Wizard/validateBasicInfo';
import StartTripConfirmModal from './StartTripConfirmModal';
import { useStartTrip } from './useStartTrip';

const INITIAL_VALUES = { country: null, city: null, startDate: '', endDate: '', people: '2' };

// 홈 "내 여행 만들기" 카드 (23). 나라·도시·날짜·인원을 받아 마법사로 넘긴다.
// 입력 중에는 이 컴포넌트 안(useState)에만 두고, [플래너 시작]을 눌러 검사를 통과하면 wizardStore에 저장한다.
// (마법사 STEP1은 반대로 입력할 때마다 바로 저장한다 — 중간 저장)
// 작성 중인 여행이 있으면 덮어쓰기 전에 확인 창을 띄운다.
export default function TripStartForm() {
  const { t } = useTranslation();
  const { requestStart, isConfirmOpen, confirmStart, continueDraft, cancelStart } = useStartTrip();
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

    requestStart({ ...values, people: Number(values.people) });
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h2 className="text-subtitle font-bold">{t('home.start.title')}</h2>
      <BasicInfoFields values={values} errors={errors} onChange={handleChange} />
      <Button type="submit" size="lg" className="w-full">
        {t('home.start.submit')}
      </Button>
      <StartTripConfirmModal
        open={isConfirmOpen}
        onConfirm={confirmStart}
        onContinue={continueDraft}
        onClose={cancelStart}
      />
    </form>
  );
}
