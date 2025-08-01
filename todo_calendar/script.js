// 공휴일 정보
// 한국천문연구원_특일 정보 api
const API_URL = "https://www.data.go.kr/data/15012690/openapi.do";

const calendar = document.querySelector("#calendar");
const weekdays = document.querySelector("#weekdays");
const days = document.querySelector("#days");
const yearMonth = document.querySelector("#year-month");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");

let date = new Date();
let currentYear = date.getFullYear();
let currentMonth = date.getMonth();

function renderCalendar(year, month) {
  weekdays.innerHTML = "";
  days.innerHTML = "";

  // 요일 -> 0(일)부터 시작 | 월 -> 0(1월)부터 시작
  const firstDay = new Date(year, month, 1).getDay(); // 0(일) ~ 6(토)
  const lastDate = new Date(year, month + 1, 0).getDate(); // 말일 -> 다음 달의 0일로 설정

  yearMonth.innerText = `${year}년 ${month + 1}월`;

  // 요일
  const weekdaysList = ["일", "월", "화", "수", "목", "금", "토"];

  weekdaysList.forEach((day) => {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("weekday");
    if (day === "일") {
      dayDiv.classList.add("sunday"); // 빨간색
    } else if (day === "토") {
      dayDiv.classList.add("saturday"); // 파란색
    }
    dayDiv.innerText = day;
    weekdays.appendChild(dayDiv);
  });

  // 날짜
  // 해당 월의 1일 요일 전까지 div 채우기
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.classList.add("day");
    days.appendChild(empty);
  }

  // 1일~말일까지 날짜 채우기
  for (let i = 1; i <= lastDate; i++) {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");
    dayDiv.textContent = i;

    // 오늘이면
    const today = new Date();
    if (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      i === today.getDate()
    ) {
      dayDiv.classList.add("today");
    }

    // 휴일 텍스트 색 변경 -> date에서 가져옴
    const holiday = new Date(year, month, i).getDay();
    if (holiday === 0) {
      // 일요일
      dayDiv.classList.add("sunday");
    } else if (holiday === 6) {
      // 토요일
      dayDiv.classList.add("saturday");
    }

    days.appendChild(dayDiv);
  }

  // 달력 크기 고정을 위해 달력의 칸 수를 42칸으로 맞추기
  // 0: 일요일
  const curDivs = days.children.length;
  console.log(curDivs);
  for (let i = curDivs; i < 42; i++) {
    const empty = document.createElement("div");
    empty.classList.add("day");
    days.appendChild(empty);
  }
}

prevBtn.addEventListener("click", () => {
  if (currentMonth == 0) {
    currentYear--;
    currentMonth = 11;
  } else {
    currentMonth--;
  }

  renderCalendar(currentYear, currentMonth);
});

nextBtn.addEventListener("click", () => {
  if (currentMonth == 11) {
    currentYear++;
    currentMonth = 0;
  } else {
    currentMonth++;
  }

  renderCalendar(currentYear, currentMonth);
});

renderCalendar(currentYear, currentMonth);
