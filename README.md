# Wandy (원디) — 프론트엔드

칠하게 떠나는 여행, 원디 / The chill way to wander.
한국·일본 여행을 마법사 7단계로 짜고, 플래너에서 DAY별 일정·지도 동선·구간별 교통 시간과 요금을 한 번에 보는 여행 플래너예요.

## 시작하기
```bash
git clone https://github.com/Front-Project-Wandy/wandy-front.git
cd wandy-front
npm install
cp .env.example .env.local   # 지도 표시 키만 채우기
npm run dev
```

## 명령어
| 명령어 | 하는 일 |
|---|---|
| `npm run dev` | 개발 서버 (http://localhost:5173) |
| `npm run build` | 배포용 빌드 |
| `npm run lint` | 코드 검사 (oxlint) |
| `npm run format` | Prettier로 `src` 정리 |

## 작업 흐름
1. `git switch develop` → `git pull`
2. `git switch -c feat/파트-기능` (예: `feat/b-place-search`)
3. 커밋: `feat: 키워드 장소 검색 (#7)`
4. `git push -u origin 브랜치이름` → GitHub에서 `develop`으로 PR
5. 범수가 검수·승인하면 Squash merge

팀 규칙 전체(폴더 담당, 공유 데이터 형식, 디자인 토큰, 금지 사항)는 [CLAUDE.md](CLAUDE.md)에 있어요.
