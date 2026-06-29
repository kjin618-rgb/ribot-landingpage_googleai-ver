# 리봇(Rebot) 랜딩페이지

카페·베이커리 소상공인을 위한 **QR 스탬프 · AI 단골 CRM** 서비스 랜딩페이지

---

## 서비스 개요

비싼 POS나 키오스크 없이, QR 코드 하나로 고객 방문 데이터를 적립합니다.  
단골 기록이 쌓이면 리봇 AI가 발걸음이 뜸해진 손님을 찾아내어 맞춤 안부 메시지·재방문 쿠폰·SNS 포스트 초안을 자동 생성합니다.

**타겟:** 토스플레이스·키오스크 미사용 독립 카페·베이커리 (종이 스탬프 카드 → 디지털 전환)

---

## 기술 스택

| 항목 | 내용 |
|---|---|
| 프레임워크 | React 19 + TypeScript |
| 빌드 도구 | Vite 6 |
| 스타일링 | Tailwind CSS v4 |
| 아이콘 | lucide-react |
| 애니메이션 | motion (Framer Motion) |
| 폼 데이터 저장 | Google Apps Script → Google Sheets |
| 배포 | Vercel |

---

## 로컬 실행

**사전 조건:** Node.js 설치 필요

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 파일 생성
cp .env.example .env.local
# .env.local 에 실제 값 입력 (아래 환경변수 항목 참고)

# 3. 개발 서버 실행
npm run dev
# → http://localhost:3000 접속
```

---

## 환경변수

`.env.local` 파일을 생성하고 아래 값을 입력합니다. (`.env.local`은 git에 커밋되지 않습니다)

```env
GEMINI_API_KEY=your_gemini_api_key
APP_URL=your_app_url
VITE_GOOGLE_SCRIPT_URL=your_apps_script_deploy_url
```

---

## Google Apps Script 설정 (폼 → 구글 시트 연동)

베타 신청 폼 데이터를 구글 시트에 저장하려면 아래 절차를 따릅니다.

### 1. 구글 시트 준비

- 파일명: `리봇 신청자_202606`
- 시트 탭명: `리봇 신청자_202606`
- 1행에 헤더 입력:

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Timestamp | Shop Name | Owner Name | Phone Number | Shop Type | Notes | Source | Submitted At |

### 2. Apps Script 코드 등록

구글 시트에서 **확장 프로그램 > Apps Script** 열고 아래 코드를 붙여넣기:

```javascript
var SHEET_NAME = "리봇 신청자_202606";
var HEADERS = ["Timestamp", "Shop Name", "Owner Name", "Phone Number", "Shop Type", "Notes", "Source", "Submitted At"];

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) { sheet = ss.insertSheet(SHEET_NAME); }
    if (sheet.getLastRow() === 0) { sheet.appendRow(HEADERS); }

    var data = JSON.parse(e.postData.contents);

    if (data.website) {
      return ContentService.createTextOutput(JSON.stringify({ result: "ignored" })).setMimeType(ContentService.MimeType.JSON);
    }

    sheet.appendRow([
      new Date(), data.shopName || "", data.ownerName || "",
      data.phoneNumber || "", data.shopType || "",
      data.notes || "", data.source || "", data.submittedAt || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({ result: "success" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("연결 정상").setMimeType(ContentService.MimeType.TEXT);
}
```

### 3. 웹 앱으로 배포

1. **배포 > 새 배포** 클릭
2. 유형: **웹 앱**
3. 다음 항목으로 실행: **나 (내 계정)**
4. 액세스 권한: **모든 사용자**
5. **배포** 클릭 → 발급된 URL을 `.env.local`의 `VITE_GOOGLE_SCRIPT_URL`에 입력

> 코드 수정 후에는 반드시 **새 배포**를 다시 생성해야 반영됩니다.

---

## Vercel 배포

1. [vercel.com](https://vercel.com) 에서 GitHub 저장소 import
2. Framework Preset: **Vite** 선택
3. Environment Variables에 `VITE_GOOGLE_SCRIPT_URL` 추가
4. **Deploy** 클릭

이후 `main` 브랜치에 push하면 자동 재배포됩니다.

---

## 페이지 구성

| 섹션 | 내용 |
|---|---|
| Hero | 메인 헤드라인 + 대시보드 프리뷰 (QR 스탬프 CRM 포지셔닝) |
| 문제 공감 | 종이 스탬프 카드·단골 이탈 현실 vs 리봇 솔루션 비교 |
| 작동방식 | QR 스캔 → 스탬프 적립 → AI 이탈 감지 → 메시지 발송 4단계 + 인터랙티브 AI 시뮬레이터 |
| 핵심기능 | 4가지 기능 카드 |
| 단골의 가치 | 매출 복귀 계산기 슬라이더 |
| 베타 신청 | 폼 → Google Sheets 연동 |

---

## 서비스 작동 방식

```
고객                           사장님 (리봇 대시보드)
 │                                     │
 ├─ QR 스캔                             │
 ├─ 전화번호 입력                         │
 ├─ (첫 방문) 마케팅 동의                  │
 └─ 스탬프 즉시 적립 ──────────────────► 방문 기록 DB 누적
                                        │
                                        ├─ AI 이탈 감지 (개인 방문 패턴 기반)
                                        ├─ 맞춤 재방문 메시지 초안 생성
                                        ├─ SNS 포스트 초안 생성
                                        └─ 사장님이 복사 → 카카오톡 수동 발송
```

---

## 보안 처리 내역

- `.env.local` git 미추적 (API URL 보호)
- honeypot 필드로 봇 스팸 방지
- 성공 화면에 개인정보 미표시
- 폼 제출 후 입력값 즉시 초기화
- 인라인/모달 폼 상태 완전 분리

---

## 변경 이력

| 버전 | 날짜 | 주요 내용 |
|---|---|---|
| v3 | 2026-06-29 | MVP 기획 반영 — POS 데이터 기반 → QR 스탬프 CRM 방식으로 서비스 컨셉 전환, 랜딩 텍스트 전면 수정 |
| v2 | 2026-06-17 | 구글 시트 폼 연동 및 보안 개선, 업종 카테고리 레이블 통일 |
| v1 | 2026-06-17 | 리봇 랜딩페이지 초기 스캐폴드 |
