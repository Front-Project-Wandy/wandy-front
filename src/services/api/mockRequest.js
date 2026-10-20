// 1단계(프론트) 동안 서버 대신 쓰는 가짜 요청. 2단계에서는 서비스 함수 안만 Axios 호출로 바꾼다.
export const MOCK_DELAY_MS = 400;

// 주소에 ?mockError 를 붙이면 요청이 실패해서 에러 화면을 확인할 수 있다.
const shouldFail = () =>
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('mockError');

export function mockRequest(getResult) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail()) {
        reject(new Error('MOCK_ERROR'));
        return;
      }
      try {
        resolve(getResult());
      } catch (error) {
        reject(error);
      }
    }, MOCK_DELAY_MS);
  });
}
