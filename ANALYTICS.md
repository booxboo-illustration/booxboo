# BOOxBOO 비공개 방문 통계

## 현재 상태

Google Analytics 웹 스트림의 측정 ID는 `G-BXGM393KN0`이며 Netlify 빌드 설정에 연결했습니다. 통계는 Google Analytics 로그인 계정에서 확인합니다. 홈페이지에 공개 통계 화면이나 공개 조회 API를 만들지 않습니다.

## 연결할 때

1. 소유자 Google 계정에 BOOxBOO GA4 속성과 `https://www.booxboo.me` 웹 스트림을 만듭니다. 시간대는 대한민국, 통화는 KRW로 설정합니다.
2. **향상된 측정은 끈 상태로 생성했습니다.** 페이지 조회와 작품·문의 이벤트는 홈페이지 코드에서 직접 보내므로 자동 기록을 켜면 중복 집계될 수 있습니다. 나중에 향상된 측정을 켜더라도 ‘브라우저 기록 이벤트에 따른 페이지 변경’은 꺼 둡니다.
3. Netlify 빌드 환경변수 `VITE_GA_MEASUREMENT_ID`에 웹 스트림의 `G-`로 시작하는 측정 ID를 넣고 재배포합니다. 광고 연동이나 Google Signals는 사용하지 않습니다.
4. 태그 설정의 세션 타임아웃은 기본값인 비활동 30분으로 유지하고, 참여 세션 타이머는 30초로 설정합니다. 따라서 같은 날이라도 30분 이상 활동이 없다가 다시 오면 새 방문입니다. 짧은 간격의 새로고침은 방문을 새로 만들지 않습니다.
5. 이벤트 범위 맞춤 측정기준 `project_id`, `project_name`, `source_page`, `contact_method`를 등록합니다. `contact_click`을 주요 이벤트로 표시합니다. 이메일 버튼 클릭은 문의 의도이며 실제 발송 완료를 뜻하지 않습니다.
6. 홈페이지 소유자의 각 기기·브라우저에서 `/analytics-settings`를 열어 **이 브라우저의 내 방문 제외**를 켭니다. 이후 그 브라우저의 방문과 클릭은 전송하지 않습니다. 과거에 이미 수집된 기록을 소급 삭제하지는 않습니다.
7. 실제 수집은 제외 설정이 없는 테스트 브라우저에서 Realtime 또는 DebugView로 확인합니다. 페이지 이동마다 `page_view`가 한 번, 작품 클릭 시 `project_click`, 상세페이지 도착 시 `project_view`가 수집되는지 검증합니다. 검증 후 소유자 브라우저의 방문 제외를 적용합니다.

## 볼 지표

| 질문 | 지표 |
| --- | --- |
| 몇 명이 왔나? | 총 사용자 수 |
| 재방문을 포함해 몇 번 왔나? | 세션 수 |
| 얼마나 관심 있게 봤나? | 참여 세션 수, 참여율, 평균 참여 시간 |
| 어떤 작품을 눌렀나? | `project_click`의 이벤트 수와 사용자 수를 작품별로 비교 |
| 링크를 통해 바로 들어온 작품은? | `project_view`의 사용자 수와 이벤트 수 |
| 작품을 충분히 봤나? | `project_interest`의 사용자 수: 해당 작품 화면을 보이는 상태로 30초 이상 본 경우 |
| 문의하려고 했나? | `contact_click` 수 |

작품 클릭은 실제 링크 클릭만 기록합니다. 새로고침은 작품 클릭으로 기록하지 않고 상세페이지 조회로만 기록합니다. 1초 이내 같은 링크를 연속으로 누르면 한 번만 기록합니다. 이후 다시 클릭하거나 나중에 재방문하면 추가로 기록합니다.

Google Analytics 참여 세션은 설정 시간 이상 머물거나, 2개 이상 페이지를 보거나, 주요 이벤트가 발생한 세션입니다. 작품별 `project_interest`는 별도 지표이며 전체 참여 세션과 혼동하지 않습니다. 탭을 숨기거나 다른 창에 포커스가 있는 시간은 이 작품 관심 이벤트의 30초에 포함하지 않습니다.

사용자 수는 브라우저 식별에 근거한 추정치입니다. 다른 기기·브라우저·시크릿 모드나 쿠키 삭제 후 접속은 별도 사용자로 잡힐 수 있습니다. 내 방문 제외도 각 브라우저에서 설정하고, 사이트 데이터를 삭제한 경우 다시 설정합니다. 로컬 개발 화면과 Netlify 미리보기는 자동 제외됩니다.

출처: [Google Analytics 사용자 지표](https://support.google.com/analytics/answer/12253918?hl=ko), [세션](https://support.google.com/analytics/answer/12798876?hl=ko), [태그 설정](https://support.google.com/analytics/answer/12131703?hl=ko), [수동 페이지 조회](https://developers.google.com/analytics/devguides/collection/ga4/views), [방문 수집 제외](https://developers.google.com/tag-platform/security/guides/privacy).
