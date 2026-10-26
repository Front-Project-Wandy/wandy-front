// 브라우저 탭 제목을 "장소 탐색 · Wandy" 모양으로 바꾼다 (90 접근성). page가 없으면 "Wandy"만.
// 화면 이동(useRouteFocus)과 마법사 단계 이동(WizardPage)이 같이 써서 모양을 한 곳에서 정한다.
export function setPageTitle(t, page) {
  document.title = page ? t('common.pageTitle.format', { page }) : t('common.pageTitle.home');
}
