import { THEME_STORAGE_KEY } from '../../../components/common/useTheme';
import { useCommunityStore } from '../../../store/community/useCommunityStore';
import { usePlanStore } from '../../../store/plan/usePlanStore';
import { useRecentStore } from '../../../store/recent/useRecentStore';
import { useWizardStore } from '../../../store/wizard/wizardStore';
import { ADMIN_STORAGE_KEY } from '../../admin/hooks/useAdminStore';
import { INTRO_SEEN_KEY } from '../../intro/constants';
import { useAuthStore } from '../hooks/useAuthStore';
import { useFavoriteStore } from '../hooks/useFavoriteStore';
import { usePlaceRatingStore } from '../hooks/usePlaceRatingStore';
import { usePreferenceStore } from '../hooks/usePreferenceStore';
import { normalizePreferences } from './preferences';

// 회원 탈퇴 (68). 1단계는 서버가 없어서 이 기기(localStorage)에 남은 내 기록을 모두 지우고 로그아웃한다.
// 2단계에서는 맨 앞에 회원 탈퇴 API(DELETE) 호출을 넣고, 성공하면 아래 기기 정리를 그대로 한다.
// 부르는 쪽이 바뀌지 않게 함수 이름과 Promise를 돌려주는 모양은 그대로 둔다.

// 내 기록이 아니라 기기·서비스 설정이라 남긴다: 화면 테마, 인트로를 본 기록, 관리자 상품 설정(85).
const KEPT_KEYS = [THEME_STORAGE_KEY, INTRO_SEEN_KEY, ADMIN_STORAGE_KEY];

// persist로 저장하는 store. 저장 키만 지우면 메모리에 남은 값이 다음 변경 때 다시 저장돼서,
// 처음 상태로 되돌린 뒤 키를 지운다. 로그인 정보(useAuthStore)도 여기서 같이 비워 로그아웃된다.
const PERSISTED_STORES = [
  usePlanStore,
  useWizardStore,
  useFavoriteStore,
  usePlaceRatingStore,
  useCommunityStore,
  useRecentStore,
  useAuthStore,
];

// 여행별 키(다녀옴 체크·준비물 체크·지출 기록)와 여행 취향은 store 밖에서 직접 저장해서,
// 남길 키를 뺀 wandy 키를 모두 지운다. 나중에 저장 키가 늘어도 여기를 고치지 않아도 된다.
const removeDeviceKeys = () => {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith('wandy') && !KEPT_KEYS.includes(key))
      .forEach((key) => localStorage.removeItem(key));
  } catch {
    // 저장소를 못 쓰는 브라우저는 처음부터 저장된 것이 없다
  }
};

export async function deleteAccountData(queryClient) {
  PERSISTED_STORES.forEach((store) => {
    store.setState(store.getInitialState(), true);
    // 저장소를 못 쓰는 브라우저에서는 persist가 붙지 않아(store.persist 없음) 메모리만 비운다.
    store.persist?.clearStorage();
  });
  removeDeviceKeys();
  usePreferenceStore.setState({ preferences: normalizePreferences(null) });
  // 장소·AI 응답 캐시에도 내 여행·취향으로 만든 결과가 남아 있어서 통째로 비운다.
  queryClient.clear();
}
