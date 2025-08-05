const calendar = document.querySelector("#calendar");
const weekdays = document.querySelector("#weekdays");
const days = document.querySelector("#days");
const yearMonthContainer = document.querySelector("#year-month-container");
const yearMonth = document.querySelector("#year-month");
const prevMonthBtn = document.querySelector("#prev-month");
const nextMonthBtn = document.querySelector("#next-month");
const dropdownContainer = document.querySelector("#dropdown-container");
const prevYearBtn = document.querySelector("#prev-year");
const nextYearBtn = document.querySelector("#next-year");
const selectYear = document.querySelector("#select-year");
const monthContainer = document.querySelector("#month-container");

let date = new Date();
let currentYear = date.getFullYear();
let currentMonth = date.getMonth();
let selectedYear = date.getFullYear();
let selectedMonth = date.getMonth();

// 공휴일 가져오는 API
async function getRestDeInfo(year, month) {
  let restDayList = [];
  const serviceKey =
    "liUByGqNJq9XRSL6HBf7RxNCQGAk11%2FWHbtkhJWhIxE2cPiCMEDOfijfmT3P%2BPlQLBbCmWILdX7piKgM8wOxjQ%3D%3D";
  const url = `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?serviceKey=${serviceKey}&solYear=${year}&solMonth=${month
    .toString()
    .padStart(2, "0")}&_type=json`;

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
    console.error("공휴일 가져오기 실패", error);
    return [];
  }
}

async function renderCalendar(year, month) {
  // 공휴일 가져오기
  let restDayList = await getRestDeInfo(year, month + 1); // 1월 = 0
  // 해당 월에 공휴일이 하루인 경우 배열이 아닌 객체 1개로 응답이 옴..
  // 배열로 강제 래핑
  if (!restDayList) {
    // 공휴일이 없는 경우
    restDayList = [];
  } else if (!Array.isArray(restDayList)) {
    restDayList = [restDayList];
  }
  // 공휴일 리스트 맵에 저장
  const restDayMap = new Map();
  if (restDayList.length > 0) {
    restDayList.forEach((restDay) => {
      const day = parseInt(restDay.locdate.toString().slice(6, 8));
      restDayMap.set(day, restDay.dateName);
    });
  }

  weekdays.innerHTML = "";
  days.innerHTML = "";

  // 요일 -> 0(일)부터 시작 | 월 -> 0(1월)부터 시작
  const firstDay = new Date(year, month, 1).getDay(); // 0(일) ~ 6(토)
  const lastDate = new Date(year, month + 1, 0).getDate(); // 말일 -> 다음 달의 0일로 설정

  yearMonth.innerText = `${year}년 ${month + 1}월▾`;
  selectYear.innerText = `${year}년`;
  selectYear.dataset.year = year;

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
    dayDiv.dataset.day = i;

    const restDayName = restDayMap.get(i) || "";
    dayDiv.innerHTML = restDayName
      ? `<div class="day-container restday">${i} <span class="restdayName">${restDayName}</span></div>`
      : `<div class="day-container">${i}</div>`;

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
  for (let i = curDivs; i < 42; i++) {
    const empty = document.createElement("div");
    empty.classList.add("day");
    days.appendChild(empty);
  }
}

prevMonthBtn.addEventListener("click", () => {
  if (currentMonth == 0) {
    currentYear--;
    currentMonth = 11;
  } else {
    currentMonth--;
  }

  renderCalendar(currentYear, currentMonth);
});

nextMonthBtn.addEventListener("click", () => {
  if (currentMonth == 11) {
    currentYear++;
    currentMonth = 0;
  } else {
    currentMonth++;
  }

  renderCalendar(currentYear, currentMonth);
});

// 드롭다운 외부 클릭 시 드롭다운 사라짐
document.addEventListener("click", (event) => {
  // 드롭다운 컨테이너 외부를 클릭했는지 확인
  if (!dropdownContainer.contains(event.target)) {
    dropdownContainer.classList.add("non-active");
  }
});

yearMonth.addEventListener("click", (event) => {
  event.stopPropagation(); // 이벤트 버블링 막기
  dropdownContainer.classList.toggle("non-active");
});

prevYearBtn.addEventListener("click", () => {
  selectedYear = selectYear.dataset.year;
  selectYear.innerText = `${--selectedYear}년`;
  selectYear.dataset.year = selectedYear;
});

nextYearBtn.addEventListener("click", () => {
  selectedYear = selectYear.dataset.year;
  selectYear.innerText = `${++selectedYear}년`;
  selectYear.dataset.year = selectedYear;
});

monthContainer.addEventListener("click", (event) => {
  const target = event.target;
  currentYear = selectedYear;
  currentMonth = parseInt(target.dataset.month); // dataset에서 꺼낸 값은 무조건 문자열
  renderCalendar(currentYear, currentMonth);
});

renderCalendar(currentYear, currentMonth);
