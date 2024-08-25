const toDoForm = document.querySelector("#todo-form");
const toDoInputEl = toDoForm.querySelector("input");
const toDoList = document.querySelector("#todo-list");

const TODOS_KEY = "todos";
let toDos = [];

function saveToDos() {
  localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
}

function onDeleteToDo(event) {
  const li = event.target.parentElement;
  li.remove();
  toDos = toDos.filter((todo) => todo.id !== parseInt(li.id)); // todo.id는 숫자, li.id는 문자이므로
  saveToDos();
  // 새로운 배열을 만들었기때문에 로컬스토리지를 업데이트해 줘야 함
}

function paintToDo(toDoObj) {
  const li = document.createElement("li");
  li.id = toDoObj.id;
  const span = document.createElement("span");
  span.innerText = toDoObj.text;
  const button = document.createElement("button");
  button.innerText = "❌";
  button.addEventListener("click", onDeleteToDo);
  li.appendChild(span);
  li.append(button);
  toDoList.appendChild(li);
}

function onToDoSubmit(event) {
  event.preventDefault();
  const newToDo = toDoInputEl.value; // newToDo는 인풋요소의 value값을 복사한 것, 따라서 기존의 인풋값과 별개가 됨
  toDoInputEl.value = ""; // newToDo로 인풋값을 복사해뒀기 때문에, 기존의 값을 비워줄 수 있음
  const newToDoObj = {
    id: Date.now(),
    text: newToDo,
  };
  toDos.push(newToDoObj); // push메소드: 대상 배열의 원본이 변경됨
  saveToDos();
  paintToDo(newToDoObj);
}

toDoForm.addEventListener("submit", onToDoSubmit);

const savedToDos = localStorage.getItem(TODOS_KEY);
if (savedToDos !== null) {
  const parsedToDos = JSON.parse(savedToDos);
  toDos = parsedToDos;
  // toDos는 빈 배열로 정의되어져 있음.
  // 따라서 새로고침을 하면(새롭게 어플리케이션 시작) 기존에 데이터가 있다해도
  // 처음에 정의되어 있는 빈배열에 다시 push하게 됨으로 기존의 데이터가 삭제가 됨
  // 이런 오류를 방지하고자, toDos의 배열이 변경될 때, 데이터가 있는 상태로 업데이트(재정의) 해주는 것임
  // useEffect처럼 웹페이지 열리는 초기에 실행되는 것
  parsedToDos.forEach(paintToDo);
  // forEach의 인수는 함수로 들어가야 하고,
  // forEach의 인수로 들어간 함수의 인수는 forEach가 사용될 배열아이템을 알아서 넣어줄 것임
  // (그렇게 되도록 만들어진 함수)
  // 위의 코드를 작성하지 않으면 로컬스토리지에 데이터가 저장되어 있어도, 새롭게 추가하는 내용만 화면에 그려짐
  // why? forEach메소드는 로컬스토리지에 저장되어있는 값(배열)으로 동작되기 때문(연속으로 동작되는 게 아님 1번만 동작됨)
}

// 위의 코드들은 함수를 정의한 것이 대부분이며
// 실제 실행되는 코드는 submit했을 때 발생하는 이벤트 리스너와 새로고침 후에 처음에 if 조건 통과 여부로 그려지는 화면
// 이렇게 두가지 뿐임을 기억하자
