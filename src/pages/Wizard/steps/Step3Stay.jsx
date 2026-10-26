import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWizardStore } from '../../../store/wizard/wizardStore';
import RadioCardGroup from '../RadioCardGroup';
import StayBookedForm from '../stay/StayBookedForm';
import { EMPTY_STAY, validateStay } from '../stay/stayOptions';
import StaySearch from '../stay/StaySearch';
import WizardNav from '../WizardNav';

const STAY_STATUSES = ['booked', 'searching'];

// STEP3 숙소 (50·49, 추가 기능). 이미 예약했으면 직접 입력, 아직이면 목업에서 고르고 외부 사이트로 예약하러 간다.
// 고른 숙소의 좌표는 STEP5 "가까운 순"과 매일 동선의 출발점이 되고,
// 체크인·체크아웃 시각은 STEP7 저장 때 플랜 store(C)로 넘어간다 (51, 일정 반영은 플래너).
export default function Step3Stay({ onPrev, onNext }) {
  const { t } = useTranslation();
  const draft = useWizardStore((state) => state.draft);
  const updateDraft = useWizardStore((state) => state.updateDraft);
  const [errorKey, setErrorKey] = useState(null);
  const stay = draft.stay;

  const saveStay = (nextStay) => {
    updateDraft({ stay: nextStay });
    setErrorKey(null);
  };

  // 건너뛰기 = 숙소 정보 없음. 골라 둔 값도 지운다 (STEP2·4와 같은 규칙).
  const handleSkip = () => {
    saveStay(null);
    onNext();
  };

  const handleNext = () => {
    const nextError = validateStay(stay);
    if (nextError) {
      setErrorKey(nextError);
      return;
    }
    onNext();
  };

  const trip = {
    city: draft.city,
    startDate: draft.startDate,
    endDate: draft.endDate,
    people: draft.people,
  };

  return (
    <div className="flex flex-col gap-5">
      <RadioCardGroup
        legend={t('wizard.stay.question')}
        options={STAY_STATUSES.map((status) => ({
          value: status,
          title: t(`wizard.stay.status.${status}.title`),
          description: t(`wizard.stay.status.${status}.description`),
        }))}
        value={stay?.status ?? null}
        onChange={(status) => saveStay({ ...EMPTY_STAY, status })}
      />

      {stay?.status === 'booked' && (
        <StayBookedForm
          stay={stay}
          city={draft.city}
          startDate={draft.startDate}
          endDate={draft.endDate}
          onChange={(patch) => saveStay({ ...stay, ...patch })}
        />
      )}
      {stay?.status === 'searching' && <StaySearch stay={stay} trip={trip} onSelect={saveStay} />}

      <p className="text-body-sm text-text/70 break-keep">{t('wizard.stay.hint')}</p>
      {errorKey && (
        <p role="alert" className="text-body-sm text-error">
          {t(errorKey)}
        </p>
      )}
      <WizardNav onPrev={onPrev} onSkip={handleSkip} onNext={handleNext} />
    </div>
  );
}
