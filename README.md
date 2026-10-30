# Wandy (완디) — 프론트엔드

칠하게 떠나는 여행, 완디 / The chill way to wander.
한국·일본 여행을 마법사 7단계로 짜고, 플래너에서 DAY별 일정·지도 동선·구간별 교통 시간과 요금을 한 번에 보는 여행 플래너예요.

- 배포 주소: https://wandy.kro.kr
- KOSTA 프론트엔드 팀 프로젝트 (2026.10.06 ~ 10.30, 프로젝트 주간 10.26 ~ 10.30)

## 주요 기능

| 영역 | 기능 |
|---|---|
| 홈 | 첫 방문 스크롤 인트로(3D 기내 장면 → 노트북 화면 → 실제 홈), 도시별 사진 배너, 도시 플립카드, 테마별 추천, 한 줄로 여행 만들기 |
| 플랜 마법사 | 기본 정보 → 항공 → 숙소 → 교통 → 가고 싶은 장소 → 주변 식당·이동 → 요약·저장의 7단계, AI 빈 날 채우기·여행 제목 추천 |
| 플래너 | DAY별 일정 편집(끌어서 순서 바꾸기·되돌리기), 지도 동선(한국 네이버·일본 구글), 구간별 교통 시간·요금, 동선 최적화, 타임라인 보기, 예상 비용·지출 기록, DAY별 날씨, 교통패스 이득 계산 |
| AI | 한 줄 요청 해석, 빈 일정 채우기, 특정 DAY 다시 짜기(비 오는 날 실내 위주), 대화형 여행 비서(Gemini, 적용 버튼을 눌러야 일정이 바뀜) |
| 장소 | 키워드·카테고리 검색, 도시별 추천, 지도 범위 검색, 장소 상세(붐비는 시간·Wandy 평점·어울리는 투어·주변 식당·편의시설) |
| 상품 | 투어·입장권·교통패스 목록, 나라·종류·1인 가격대 필터, 내 일정에 바로 넣기, 외부 예약 사이트 연결 |
| 여행 준비 | 준비물 체크리스트, 입국 안내, 공휴일·행사, 여행 회화 카드, 공유·내보내기(글 복사·카카오톡/LINE·PDF 인쇄) |
| 회원 | 소셜 로그인(카카오·네이버·구글)·게스트 모드, 마이페이지(내 여행·다녀온 곳 평가·취향·찜), 회원 탈퇴 |
| 커뮤니티 | 다른 여행자의 공개 일정 둘러보기, 내 여행으로 가져오기, 장소 후기 |
| 관리자 | 상품 숨기기·추천 고정 |
| 공통 | 라이트·다크 모드, 모바일 우선 반응형(360px부터) |

### 1단계에서 알아 둘 것
- 백엔드 없이 동작하는 1단계예요. 여행·회원·후기는 브라우저 localStorage에 저장돼요.
- 장소·항공·숙소·상품은 `src/mocks`의 더미 데이터를 써요. 실제 예약은 외부 사이트 검색 링크로 보내요.
- 여행 비서의 Gemini 연결은 개발 서버(`npm run dev`)에서만 동작해요. 키가 브라우저로 나가지 않게 일부러 그렇게 만들었고, 배포판은 가짜 비서가 답해요.

## 기술 스택

| 구분 | 사용 |
|---|---|
| 프론트 | React 19, JavaScript, Vite 8, Tailwind CSS 4 |
| 라우팅·상태 | React Router 7, Zustand(persist), TanStack Query, Axios |
| 지도 | 네이버 지도(한국), 구글 지도(일본) |
| 화면 | react-i18next, dnd-kit(끌어서 놓기), GSAP·Motion(애니메이션), React Bits(캐러셀·플립카드) |
| 품질 | oxlint, Prettier, GitHub Actions CI(lint·build) |
| 배포 | Docker(nginx) 이미지 → GHCR → AWS EC2, `main`에 머지하면 자동 배포 |

## 팀

| 파트 | 이름 | 맡은 것 |
|---|---|---|
| A | 민세빈 | 홈, 플랜 마법사, 공통 컴포넌트, 다국어·테마, 커뮤니티 |
| B | 박범수 | 장소 검색·상세, 식당 추천, 상품, AI, 회원·마이페이지, 관리자, 스크롤 인트로, 디자인 총괄, PR 검수 |
| C | 서인석 | 플래너, 지도·동선, 교통, 예산, 여행 준비 도구, 배포 |

## 시작하기
```bash
git clone https://github.com/Front-Project-Wandy/wandy-front.git
cd wandy-front
npm install
cp .env.example .env.local   # 지도 표시 키만 채우기
npm run dev
```

`.env.local`에 넣는 값은 `.env.example`에 설명이 있어요. 지도 키가 비어 있으면 지도 자리에 안내만 나와요.

## 명령어
| 명령어 | 하는 일 |
|---|---|
| `npm run dev` | 개발 서버 (http://localhost:5173) |
| `npm run build` | 배포용 빌드 |
| `npm run lint` | 코드 검사 (oxlint) |
| `npm run format` | Prettier로 `src` 정리 |

## 폴더 구조
```
src/
  pages/        화면 (Home, Wizard, Planner, Places, PlaceDetail, Products, Community, MyPage, Admin …)
  features/     기능별 components·hooks·utils (search, ai, trip, map, transport, budget, product, member …)
  components/   공통 컴포넌트 (Button, Modal, Header …)
  services/api/ API 호출 함수 (1단계는 더미 데이터를 돌려줌)
  store/        Zustand store (plan, wizard, recent, community)
  mocks/        장소·항공·숙소·상품 더미 JSON
  i18n/         화면 문구
  styles/       디자인 토큰 (색·글자 크기)
  vendor/       외부 원본 컴포넌트 (React Bits)
```

## 작업 흐름
1. `git switch develop` → `git pull`
2. `git switch -c feat/파트-기능` (예: `feat/b-place-search`)
3. 커밋: `feat: 키워드 장소 검색 (#7)`
4. `git push -u origin 브랜치이름` → GitHub에서 `develop`으로 PR
5. 범수가 검수·승인하면 Squash merge
6. 하루 끝에 `develop` → `main` PR을 Merge commit으로 올리면 배포돼요

팀 규칙 전체(폴더 담당, 공유 데이터 형식, 디자인 토큰, 금지 사항)는 [CLAUDE.md](CLAUDE.md)에 있어요.

## 다음 단계
- **2단계 백엔드** (별도 레포 `wandy-back`, Spring Boot·JPA·MySQL): 회원·여행 저장을 서버로 옮기고, 네이버 검색·TourAPI·Gemini 같은 비밀 키를 서버에서만 써요. 검색 결과 캐싱도 이때 넣어요.
- **확장**: 영어·일본어 화면, 실제 항공·숙소 예약 연동, 동행자 공동 편집, 오프라인 일정 보기.
