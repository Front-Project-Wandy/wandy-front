import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/common/Button';
import BasicInfoFields from '../Wizard/BasicInfoFields';
import { clearFieldErrors, validateBasicInfo } from '../Wizard/validateBasicInfo';

const INITIAL_VALUES = { country: null, city: null, startDate: '', endDate: '', people: '2' };

// 홈 "내 여행 만들기" 카드의 [직접 입력] 탭 (23). 나라·도시·날짜·인원을 받아 onStart로 넘긴다.
// 입력 중에는 이 컴포넌트 안(useState)에만 두고, [플래너 시작]을 눌러 검사를 통과하면 넘긴다.
// (마법사 STEP1은 반대로 입력할 때마다 바로 저장한다 — 중간 저장)
// 작성 중인 여행 확인 창은 [한 줄로] 탭과 같이 쓰려고 StartTripCard가 맡는다.
export default function TripStartForm({ onStart }) {
  const { t } = useTranslation();
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

    onStart({ ...values, people: Number(values.people) });
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
      <BasicInfoFields values={values} errors={errors} onChange={handleChange} />
      <Button type="submit" size="lg" className="w-full">
        {t('home.start.submit')}
      </Button>
    </form>
  );
}
