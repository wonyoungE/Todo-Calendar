# 📅 Custom Calendar Project

이 프로젝트는 **HTML, CSS, JavaScript**로 제작한 커스텀 달력 UI입니다.  
드롭다운으로 **연도/월 선택**이 가능합니다.
또한, **한국천문연구원 공휴일 API**를 활용하여 해당 월의 공휴일을 자동 표시합니다.
> API 출처: [한국천문연구원_특일 정보 (data.go.kr)](https://www.data.go.kr/data/15012690/openapi.do)



## ✨ 기능

- **연도/월 선택 드롭다운**
  - 현재 연/월 표시
  - 클릭 시 연도와 월 선택 가능
  - 외부 영역 클릭 시 드롭다운 자동 닫힘
 
-  **달력 렌더링**
  - 해당 월의 날짜 자동 계산
  - 오늘 날짜 하이라이트
  - 공휴일 표시 -> **한국천문연구원 공휴일 API** 연동

- **사이드 네비게이션(nav)**
- 할 일 목록(To-do list)
- 오늘 일정(추후 기능 추가 예정)



## 🔨 기술 스택
- HTML5
- CSS3
- Vanilla JavaScript (ES6)
- 한국천문연구원_특일 정보 API



## 📂 프로젝트 구조
📦 project-root
├── index.html # 메인 HTML
├── style.css # 스타일 시트
├── script.js # 달력 렌더링 및 이벤트 처리
├── img/ # 아이콘, 버튼 이미지
└── README.md # 프로젝트 설명

 

## 📸 스크린샷
### 달력화면
<img width="1915" height="944" alt="image" src="https://github.com/user-attachments/assets/118713f2-a9aa-4693-8896-43cf6d34cd7e" />
### 드롭다운
<img width="1918" height="944" alt="image" src="https://github.com/user-attachments/assets/19e154bb-2943-45ad-8c20-e7145cd2ec5c" />



## 📌 개선 예정
- 일정 추가 / 삭제 기능
- 다크모드

## 공휴일 API 연동 예시
**한국천문연구원_특일 정보** 중 공휴일 API를 사용하여 특정 연도의 공휴일 목록을 가져오는 코드입니다.
`data.go.kr`에서 **서비스 키**를 발급받아 교체하면 사용 가능합니다.

``` javascript
// 공휴일 API 호출 예시
async function getRestDeInfo(year, month) {
  const serviceKey = "발급받은_서비스키"; // URL 인코딩된 서비스 키
  // month를 2자리 문자열(제로 패딩)로 변환: 1 → "01", 2 → "02"
  // 데이터를 json형태로 가져옵니다.
  const url = `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?serviceKey=${serviceKey}&solYear=${year}&solMonth=${month.toString().padStart(2, "0")}&_type=json`;

  try {
     // 요청 보내기
    const response = await fetch(url);
    const text = await response.text();
    // 자바스크립트의 객체 형태로 파싱
    const responseData = await JSON.parse(text);
    // 공휴일 목록만 가져오기
    restDayList = responseData.response.body.items.item;

    return restDayList;
  } catch (error) {
    console.error("공휴일 데이터 불러오기 실패:", error);
  }
}

// 사용 예시
getRestDeInfo(2025, 3);
# Countdown-Timer
