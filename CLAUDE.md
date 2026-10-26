# Wandy (원디) — 팀 공용 CLAUDE.md
<!-- 초안: 회의에서 확정되면 이 줄 삭제. 수정은 PR로만 -->

한국·일본 여행 일정 플래너. 여행지·날짜 입력 → 마법사(7단계)로 장소·식당·교통을 고르고 → 플래너에서 DAY별 일정과 지도 동선을 편집한다.
3명이 각자 Claude로 코딩한다. 이 파일은 모두가 같이 쓰는 규칙이므로 바꿀 때는 PR로 올리고 팀원 확인을 받는다.

## 기술 스택
- 프론트: React + JavaScript(ES6+, TypeScript 아님) + Vite + Tailwind CSS
- 라우팅 React Router / 서버 데이터 TanStack Query + Axios / 전역 상태 Zustand
- 지도: 한국 = 네이버 지도, 일본 = 구글 지도
- 백엔드(2단계, 별도 레포 `wandy-back`): Java + Spring Boot + Spring Data JPA + MySQL + JUnit 5
- 배포(3단계): Docker + GitHub Actions
- 단계: 01 프론트 UI → 02 백엔드 연동 → 03 DevOps. 1단계 동안 저장은 localStorage로 대신한다.

## 명령어
- `npm install` / `npm run dev` / `npm run build` / `npm run lint`
- 작업 하나 끝날 때마다, 그리고 커밋 전에 `npm run lint`와 `npm run build`가 통과해야 한다.

## 폴더 구조와 담당 파트
<!-- A/B/C 표기는 그대로 둔다. 담당자는 노션 요구사항 목록에서 관리 -->

    src/
      pages/Home, pages/Wizard                 → A
      components/common, i18n/, styles/        → A (공통 컴포넌트·번역 키·테마)
      store/wizard                             → A (마법사 진행 단계·중간 저장)
      pages/PlaceDetail, pages/MyPage          → B
      pages/Login, pages/Products              → B
      features/search, restaurant, product, ai, member → B (회원·내 여행 포함)
      services/api/                            → B (Axios 인스턴스, API 호출 함수 전부)
      pages/Planner                            → C
      features/map, transport, budget, trip    → C
      store/plan                               → C (플랜 데이터)
      mocks/                                   → 항공·숙소·투어 상품 더미 JSON

- 기능 폴더 안은 `components/`, `hooks/`, `utils/`로 나눈다.
- 자기 파트 폴더 밖의 파일은 수정하지 말고, 필요하면 먼저 사용자에게 물어본다.

## 공유 계약 (한 파트가 정의, 나머지는 가져다 쓰기만)
공유 파일을 바꿔야 하면 코드를 고치지 말고 "OO 파트에 요청하세요"라고 사용자에게 알린다.

### Place — B, `src/features/search/place.js`
네이버·구글·TourAPI 결과는 전부 이 모양으로 변환(정규화)해서 넘긴다. 화면에서 원본 API 응답을 직접 쓰지 않는다.

    {
      id: 'google:ChIJxxx',   // '출처:원본ID'. 네이버는 고유 ID가 없어서 'naver:이름_좌표'
      source: 'google',       // 'google' | 'naver' | 'tour'
      sourceId: 'ChIJxxx',    // 구글 place_id / TourAPI contentid
      name: '오사카성',
      country: 'JP',          // 'KR' | 'JP'
      city: 'osaka',
      category: 'sight',      // 'sight' | 'food' | 'cafe' | 'shop' | 'nature' | 'night' | 'onsen'
      lat: 34.6873,
      lng: 135.5262,
      address: '',
      imageUrl: null,
      rating: null,           // JP(구글)만
      openingHours: null,     // JP(구글)만
      externalUrl: null       // KR은 네이버 지도 링크
    }

### 플랜 store — C, `src/store/plan`
Zustand + `persist`(localStorage). 2단계에서 서버 저장으로 바꾼다.

    // trip
    { id, title, country, city, startDate, endDate, people,
      style: 'normal',        // 'relaxed' | 'normal' | 'packed'
      transportMode: null,    // 'transit' | 'taxi' | 'car' | 'mixed' | null (마법사 STEP4, null = 건너뜀 → 계산할 때 혼합)
      budget: null,
      flight: null,           // { flightNo, returnFlightNo, arriveAt, departAt, link }
      stay: null,             // { name, address, lat, lng, checkIn, checkOut, link } (address는 참고용, 없으면 null)
      days: [], updatedAt }
    // day
    { date: '2026-10-26', items: [] }
    // item — 약관 때문에 Place 전체를 저장하지 않는다
    { id,
      placeId: 'google:ChIJxxx', // Place.id
      source: 'google',          // Place.source
      name: null,                // JP(구글)는 저장하지 않고(null) 화면에서 placeId로 다시 불러온다
      lat, lng,
      coordsCachedAt,            // 좌표 저장 시각. 30일이 지나면 다시 불러온다
      myCategory: 'sight',       // 우리가 정한 카테고리
      startTime: '10:00', stayMinutes: 90, memo: '',
      transportToNext: null }    // { mode: 'walk'|'transit'|'taxi'|'car', minutes, cost }

- 함수: `setTripInfo, setFlight, setStay, addItem(dayIndex, place, { startTime, stayMinutes }), removeItem(dayIndex, itemId), moveItem(from, to), updateItem(dayIndex, itemId, patch), resetTrip`
- 다른 파트는 store 함수로만 값을 바꾼다. 마법사 진행 단계는 `store/wizard`(A)에 따로 둔다.
- `addItem`은 Place를 받아서 위 item 모양으로 바꿔 저장한다 (구글 장소의 이름·주소·사진·평점은 버린다)
  - 세 번째 인자(`startTime` 'HH:mm', `stayMinutes` 양의 정수)는 선택이다. 없거나 형식이 틀리면 기본값(10:00, 90분)을 쓴다. AI 채우기처럼 시각이 정해진 일정을 한 번에 넣을 때 쓴다.

### 공통 컴포넌트 — A, `src/components/common`
- `Button` (variant: primary·secondary·ghost / size: sm·md·lg / disabled / loading / onClick)
- `Input` (label, value, onChange, placeholder, error) / `Chip` (label, selected, onClick) / `Card` (children, onClick)
- `Modal` (open, onClose, title, children) / `Header` / `TabBar`
- `Loading` (text) / `EmptyState` (title, description, action) / `ErrorState` (message, onRetry)
- 새 공통 컴포넌트가 필요하면 직접 만들지 말고 A에 요청한다.

### 그 외
- 지도 컴포넌트·교통 계산 함수 → C / 식당 추천 컴포넌트·AI(Gemini) 호출 함수 → B
- API 응답(2단계): 성공 `{ data }`, 실패는 HTTP 상태코드 + `{ error: { code, message } }`. `services/api`는 성공 시 `data`만 반환하고 실패 시 에러를 던진다.

## 디자인 기준
- Tailwind 테마에 등록한 값만 쓴다. 색 코드·px 값을 컴포넌트에 직접 쓰지 않는다.
- 색은 CSS 변수(`--color-primary` 등)로 정의하고 Tailwind가 그 변수를 쓰게 한다 (다크모드 대비).

| 이름 | 값 | 쓰는 곳 |
|---|---|---|
| brand | `#38BDF8` | 히어로, 일러스트, 선택된 칩 배경 |
| primary | `#0284C7` | 주요 버튼, 진행 표시줄 |
| link | `#0369A1` | 작은 링크 글자 |
| point | `#FF7A59` | 찜, 배지, D-day, 알림 (작게만) |
| bg / bg-soft | `#FFFFFF` / `#F0F9FF` | 기본 배경 / 섹션 구분 |
| text | `#1E293B` | 본문 |
| error | `#EF4444` | 에러 |

- 흰 글자는 `primary` 위에서만, 16px 이상 굵게. `brand` 위에는 흰 글자 금지.
- DAY별 색 (지도 마커·동선): DAY1 `#F97316` / DAY2 `#22C55E` / DAY3 `#A855F7` / DAY4 `#EC4899` / DAY5 `#EAB308`(흰 테두리). 파랑 계열은 쓰지 않는다.
- 폰트: Pretendard, 일본어는 Noto Sans JP 대체 폰트.
- 글씨 크기: 12 / 14 / 16(본문) / 20 / 24 / 32 px.
- 모서리: 카드 `rounded-2xl`, 버튼·입력창 `rounded-xl`, 칩·배지 `rounded-full`.
- 간격: 4px 배수, 화면 좌우 여백 모바일 16px · PC 24px.
- 반응형: 모바일 우선, Tailwind 기본 기준(`sm` 640 / `md` 768 / `lg` 1024). 플래너는 `lg`부터 목록·지도 좌우 분할.
- Tailwind 클래스 이름 (`src/styles/index.css`): 색 `bg-primary`·`text-text`·`bg-bg-soft`·`bg-day-1` 등, 글씨 `text-caption`(12) `text-body-sm`(14) `text-body`(16) `text-subtitle`(20) `text-title`(24) `text-display`(32). 기본 팔레트(`gray-200` 등)는 꺼 두어서 써도 적용되지 않는다. 연한 색은 `text-text/70`처럼 투명도로 만든다.

## 코딩 규칙
- 함수형 컴포넌트 + 훅만 사용. 파일 하나에 컴포넌트 하나.
- 이름: 컴포넌트 `PascalCase.jsx`, 함수·변수 `camelCase`, 상수 `UPPER_CASE`, 훅은 `use~`, 이벤트 함수 `handle~`, 이벤트 props `on~`.
- export: 컴포넌트는 `export default`, 유틸·훅·상수는 named export.
- 로직과 화면 분리: API 호출은 `services/api`, 계산은 `features/*/utils`, 컴포넌트는 화면만.
- 상태: 서버 데이터 → TanStack Query / 여러 화면이 공유 → Zustand / 한 컴포넌트 안 → useState.
- 화면 글자는 전부 `t('key')`. 키 이름은 `화면.영역.이름` (예: `planner.day.addPlace`).
- 모든 데이터 화면에 로딩·빈 화면·에러 상태를 만든다 (`Loading`, `EmptyState`, `ErrorState`).
- 주석은 한국어로, 왜 그렇게 했는지만 쓴다.
- 형식(세미콜론·따옴표·들여쓰기)은 Prettier 설정을 따른다: 세미콜론 O, 작은따옴표, 2칸, 한 줄 100자.

## 하지 말 것
- TypeScript, 별도 CSS 파일, 인라인 `style={{}}`, 정해지지 않은 UI 라이브러리
- 색 코드·글자 하드코딩
- 목업 데이터를 컴포넌트 안에 직접 쓰기 (`src/mocks/`에 JSON으로)
- 파일 하나 300줄 넘기기 (넘으면 쪼갠다)
- `console.log`를 남긴 채 커밋
- 묻지 않고 새 npm 패키지 설치

## 보안 (반드시 지킬 것)
- `.env`는 절대 커밋하지 않는다. 새 키가 생기면 `.env.example`에 이름만 추가한다.
- 비밀 키(네이버 검색, TourAPI, Gemini, Directions 등)는 프론트 코드에 넣지 않는다. 2단계부터 Spring Boot 서버에서만 사용.
- `VITE_` 접두사는 도메인 제한이 걸린 지도 표시용 키에만 쓴다.

## 지도·장소 데이터 약관
- 구글 장소 데이터는 구글 지도 위에서만 보여준다.
- 구글 장소는 `place_id`만 저장한다. 위도·경도 캐시는 최대 30일.
- 구글 로고와 리뷰 작성자 표시를 유지한다.
- 네이버·구글 페이지 크롤링 금지. 공식 API만 사용.

## 항공·숙소·투어 상품
- 실제 예약 API는 쓰지 않는다.
- 예약 정보는 사용자가 직접 입력하거나 `src/mocks/` 더미 목록에서 고르고, 실제 예약은 외부 사이트 검색 링크로 보낸다.

## Git
- 브랜치: `main`(발표·배포용, 항상 동작) / `develop`(통합, 기본 브랜치) / `feat/파트-기능` (예: `feat/c-planner-drag`), `fix/파트-내용`
- 커밋: `타입: 한국어 설명 (#요구사항NO)` — 예: `feat: 플래너 드래그 순서 변경 (#16)`
  - 타입: `feat` 기능 / `fix` 버그 / `style` 화면만 / `refactor` 구조 / `docs` 문서 / `chore` 설정
- `main`·`develop`에 직접 푸시 금지 (GitHub 규칙으로 막혀 있음). `feat/*` → `develop` PR.
- 작업 시작 전: `develop`을 최신으로 받고(`git switch develop && git pull --ff-only`) 거기서 새 브랜치를 만든다.
- push·PR 전: `develop` 최신을 내 브랜치에 합치고(`git fetch && git merge origin/develop`) lint·build를 다시 확인한다. 충돌은 이때 푼다.
- 모든 PR은 범수(@pbs3839-afk)가 최종 검수·승인한다 (`.github/CODEOWNERS`). 승인되면 올린 사람이 Squash merge.
- 승인받은 뒤에는 꼭 필요할 때만 push한다 (새 커밋이 올라가면 승인이 자동으로 취소된다).
- 하루 끝에 동작 확인 후 `develop` → `main` PR을 Merge commit으로 올린다 (Squash로 합치면 두 브랜치 기록이 갈라져서 다음 날 충돌이 난다).
- 충돌: 공유 파일은 그 파일 담당 파트가, 나머지는 PR 올린 사람이 `develop`을 받아서 해결.

## Claude 작업 방식
- 설명과 커밋 메시지는 한국어로.
- 큰 작업은 바로 코딩하지 말고 계획을 먼저 보여주고 확인받는다.
- 작업 단위를 작게 나누고, 하나 끝날 때마다 lint·build를 확인한다.
- 요구사항 번호(노션 요구사항 목록 NO)가 있으면 커밋·PR에 같이 적는다.
- PR 리뷰 코멘트는 무조건 반영하지 않는다. 코멘트마다 먼저 재현·확인한다.
  - 맞으면 고치고, 무엇을 어떻게 고쳤는지 그 코멘트에 답글로 남긴다.
  - 틀렸거나 더 나은 방법이 있으면 틀린 부분을 근거(재현 결과, 부작용)와 함께 답글로 남기고, 고치지 않거나 다른 방법으로 고친다.
  - 사용자의 제안도 같은 기준으로 검토하고, 동의하지 않으면 이유를 말한다.
- Claude가 GitHub에 다는 댓글·답글은 맨 앞에 `[Claude]`를 붙인다 (사람이 쓴 글과 구분하려고).
