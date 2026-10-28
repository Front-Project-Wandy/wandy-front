// 사용자 기준 통화의 나라. 지금은 화면 언어로 정한다: 일본어면 엔화(JP), 나머지는 원화(KR).
// 여행 나라와 같으면 환산할 필요가 없다. 2단계에서 회원 설정에 통화가 생기면 여기만 바꾼다.
export const getHomeCountry = (language) => (language?.startsWith('ja') ? 'JP' : 'KR');
