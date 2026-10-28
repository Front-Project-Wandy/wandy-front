import { createPreferredTripDraft } from '../../features/member/utils/createPreferredTripDraft';
import { saveWizardTrip } from '../Wizard/summary/saveWizardTrip';

// 마법사를 거치지 않고 입력한 기본 정보(나라·도시·날짜·인원)만으로 빈 플랜을 만들어 저장한다 (53 「직접 짤게요」).
// 프로필의 스타일·카테고리는 새 여행 기본값으로 넣고(65), 항공·숙소·장소·교통 방식은 비워 둔다.
// 마법사 초안(wizardStore)은 건드리지 않아서, 작성 중이던 여행이 있어도 그대로 남는다.
// 저장은 마법사와 같은 saveWizardTrip을 써서 이전 여행이 보관함으로 가는 것까지 똑같다. 새 여행 id를 돌려준다.
export function startManualTrip({ values, preferences, title }) {
  const draft = {
    ...createPreferredTripDraft(values, preferences),
    companion: null,
    budget: null,
    transportMode: null,
    flight: null,
    stay: null,
  };
  return saveWizardTrip({ draft, spots: [], title, placesById: {} });
}
