// DOM 요소 불러오기
const todoList = document.querySelector("#todo-list");
const todoInput = document.querySelector("#todo-input");
const todoAddBtn = document.querySelector("#todo-add-btn");

// 로컬 스토리지에서 할 일 목록 불러오는 함수
function getTodos() {
  const todos = localStorage.getItem("todos");
  return todos ? JSON.parse(todos) : [];
}

// 할 일 목록 HTML에 렌더링하는 함수
function RenderTodos() {
  const todos = getTodos();
  // 기존 목록 초기화
  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const todoLi = document.createElement("li");
    todoLi.classList.add("todo-items");

    const todoItem = document.createElement("div");
    todoItem.classList.add("item");

    // 체크박스
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `${todo.id}`;
    
    checkbox.checked = todo.completed;
    // 체크박스 상태 변경 이벤트 리스너
    todoItem.addEventListener("click", () => {
      toggleTodoComplete(todo.id);
    });

    // 라벨
    const label = document.createElement("label");
    label.for = `${todo.id}`;
    label.classList.add("item-label");
    label.textContent = todo.text;

    todoItem.appendChild(checkbox);
    todoItem.appendChild(label);

    // 삭제 버튼
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "삭제";
    deleteBtn.classList.add("navBtn");
    deleteBtn.id = "todo-delete-btn";
    deleteBtn.onclick = () => deleteTodo(todo.id);

    // 만든 요소들을 할 일 li에 추가
    todoLi.appendChild(todoItem);
    todoLi.appendChild(deleteBtn);

    // li를 ul에 추가
    todoList.appendChild(todoLi);
  });
}

// 할 일 추가하는 함수
function addTodo() {
  console.log("여기");
  const newText = todoInput.value.trim();
  if (newText == "") return; // 입력값이 비어있으면 추가 안 함

  const todos = getTodos();
  const newTodo = {
    id: Date.now(), // 고유 ID 생성
    text: newText,
    completed: false,
  };

  // 새 할 일 추가
  todos.push(newTodo);
  console.log(todos);
  localStorage.setItem("todos", JSON.stringify(todos));

  // 입력창 비워주기
  todoInput.value = "";
  RenderTodos();
}

// 할 일 삭제하는 함수
function deleteTodo(todoId) {
  const todos = getTodos();
  const updateTodos = todos.filter((todo) => todo.id !== todoId);
  localStorage.setItem("todos", JSON.stringify(updateTodos));
  RenderTodos();
}

// 할 일 complete 상태 토글 함수
function toggleTodoComplete(todoId) {
  const todos = getTodos();
  const updateTodos = todos.map((todo) => {
    if (todo.id === todoId) {
      // 상태 반전 시키기
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  localStorage.setItem("todos", JSON.stringify(updateTodos));
  RenderTodos();
}

// 페이지 로드 시 할 일 목록 렌더링
document.addEventListener("DOMContentLoaded", RenderTodos);

todoAddBtn.addEventListener("click", addTodo);
// 엔터키 눌렀을 때도 할 일 추가 발생
todoInput.addEventListener("keypress", (event) => {
  const key = event.key;
  if (key === "Enter") {
    addTodo();
  }
});
