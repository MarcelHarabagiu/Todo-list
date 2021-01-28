
let todoInput;
let todoButton;
let todoList;
let filterOption;

// enum
const STATES = {
  COMPLETED: 1,
  CANT_FIX: 2
}

const filterDropdownOptions = [
  { text: 'All', clickAction: filterTodoAll },
  { text: 'Completed', clickAction: filterTodoCompleted },
  { text: 'Not Yet Completed', clickAction: filterTodoUnCompleted },
  { text: 'Cant Fix', clickAction: filterTodoCantFix }
];

const modelTodos = [];

window.onload = DOMisReady;

function buildDropdownFilterOptions() {
  const filterList = document.querySelector('.filter-todo');
  filterDropdownOptions.forEach( item => {
    const text = item.text;
    const option = document.createElement('option');
    filterList.appendChild(option);
    option.text = text
    option.value = text;
  });
}

function filterTodoAll() {
  todoList.childNodes.forEach((todo) => {
    todo.style.display = 'flex';
  });
}
function filterTodoCompleted() {
  todoList.childNodes.forEach((todo) => {
    if (todo.classList.contains('completed')) {
      todo.style.display = 'flex';
    } else {
      todo.style.display = 'none';
    }
  });
}
function filterTodoUnCompleted() {
  todoList.childNodes.forEach((todo) => {
    if (!todo.classList.contains('completed')) {
      todo.style.display = 'flex';
    } else {
      todo.style.display = 'none';
    }
  });
}
function filterTodoCantFix() {
  todoList.childNodes.forEach((todo) => {
    if (todo.classList.contains('state-cantfix')) {
      todo.style.display = 'flex';
    } else {
      todo.style.display = 'none';
    }
  });
}
const saveTheUpdatedModel = (itemToRemove) => {
  let modelToSave = filterModelForSaving(itemToRemove);
  localStorage.setItem('todos', JSON.stringify(modelToSave));
}

//Functions 
function addTodo() {
  const curTime = new Date().getTime();
  const todoText = todoInput.value;
  const newId = addToModel(todoText, curTime);
  todoInput.value = '';
  createAndShowElementOnDom(todoText, newId, curTime);
  saveTheUpdatedModel();
}

let addToModel = (text, time, state) => {
  const id = (modelTodos.length === 0) ? 0 : modelTodos[modelTodos.length-1].id + 1;
  modelTodos.push({ id, text, time, state });
  return id;
}
let createAndShowElementOnDom = (text, id, time) => {
  const todoDiv = document.createElement('div');
  todoDiv.classList.add('todo');
  const newTodo = document.createElement('li');
  const timeElement = document.createElement('div');

  let curTime = new Date();
  let oldTime = new Date(time);
  let deltaTime = curTime - oldTime; // number
  let deltaDate = new Date(deltaTime);

  // or 
  // new Date(new Date() - new Date(deltaTime))

  timeElement.innerText = `(${deltaDate.getMinutes()} min old)`;
  newTodo.innerText = text;
  newTodo.classList.add('todo-item');
  todoDiv.setAttribute('modelid', id);
  todoDiv.appendChild(newTodo);
  todoDiv.appendChild(timeElement);
  todoList.appendChild(todoDiv);
  createCompletedButton(todoDiv);
  createTrashButton(todoDiv);
  createCantFixButton(todoDiv);
  return todoDiv;
}

function filterTodo(e) {
  let index = e.target.selectedIndex;
  let objectInArray = filterDropdownOptions[index];
  objectInArray.clickAction();
}

function getTodos() {
  let todos;
  if (localStorage.getItem('todos') === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem('todos'));
  }
  todos.forEach(item => {
    const newId = addToModel(item.text, item.time, item.state); // TODO ionut make sure update isnt called on each itteration of the loop and only when the loop ends
    const todoElement = createAndShowElementOnDom(item.text, newId, item.time);
    if (item.state === STATES.COMPLETED) {
      toggleCompleted(todoElement);
    }
    if (item.state === STATES.CANT_FIX) {
      toggleCantFix(todoElement);
    }
  });
}
function createCantFixButton(todoDiv) {
  const button = document.createElement('button');
  button.innerText = 'cant fix';
  button.addEventListener('click', handlerClickCantFixButton);
  todoDiv.appendChild(button);
}
function createTrashButton(todoDiv) {
  const trashButton = document.createElement('button');
  trashButton.addEventListener('click', handlerClickTrashButton);
  trashButton.classList.add('trash-btn');
  const iconTrashButton = document.createElement('iconTrashButton');
  iconTrashButton.classList.add('fas', 'fa-trash');
  trashButton.appendChild(iconTrashButton);
  todoDiv.appendChild(trashButton);
}

function createCompletedButton(todoDiv) {
  const completedButton = document.createElement('button');
  completedButton.addEventListener('click', handlerClickCompletedButton);
  completedButton.classList.add('completed-btn');
  todoDiv.appendChild(completedButton);
  const icon = document.createElement('i');
  icon.classList.add('fas', 'fa-check');
  completedButton.appendChild(icon);
}

let getIdFromEvent = (clickEvent) => {
  const item = clickEvent.target;
  const todo = item.parentElement;
  const modelId = todo.getAttribute('modelid'); // this is a string
  return Number(modelId);
}
let getTextFromEvent = (clickEvent) => {
  const item = clickEvent.target;
  const todo = item.parentElement;
  const text = todo.innerText;
  return text;
}
let getItemInModelFromEvent = (clickEvent) => {
  const modelId = getIdFromEvent(clickEvent);
  const itemInModel = modelTodos.find(item => item.id === modelId);
  return itemInModel;
}
let filterModelForSaving = (itemToRemove) => {
  const filteredModel = modelTodos.filter(item => item !== itemToRemove);
  const nonIdList = filteredModel.map(item => {
    return {
      text: item.text,
      time: item.time,
      state: item.state
    }
  });
  return nonIdList;
}
const toggleCompleted = (element) => {
  element.classList.toggle('completed');
}
const toggleCantFix = (element) => {
  element.classList.toggle('state-cantfix');
}
function handlerClickCompletedButton(event) {
  const item = event.target;
  const todo = item.parentElement;
  toggleCompleted(todo);

  const itemInModel = getItemInModelFromEvent(event);
  if (itemInModel.state === STATES.COMPLETED) {
    itemInModel.state = undefined;
  } else {
    itemInModel.state = STATES.COMPLETED;
  }
  saveTheUpdatedModel();
}
function handlerClickTrashButton(event) {
  const item = event.target;
  const todo = item.parentElement;
  const text = getTextFromEvent(event);

  const itemInModel = getItemInModelFromEvent(event);
  if (itemInModel) {
    animateElementAway(todo);
    saveTheUpdatedModel(itemInModel);
  } else {
    console.log('we fucked up finding the item in the model correctly');
  }
}
function handlerClickCantFixButton(event) {
  const item = event.target;
  const todo = item.parentElement;
  toggleCantFix(todo);

  const itemInModel = getItemInModelFromEvent(event);
  if (itemInModel.state === STATES.CANT_FIX) {
    itemInModel.state = undefined;
  } else {
    itemInModel.state = STATES.CANT_FIX;
  }
  saveTheUpdatedModel();
}

let animateElementAway = (element) => {
  element.classList.add('fall');
  element.addEventListener('transitionend', function () {
    element.remove();
  });
}

function DOMisReady() {
  //select DOM
  todoInput = document.querySelector('.todo-input');
  todoButton = document.querySelector('.todo-button');
  filterOption = document.querySelector('.filter-todo');
  todoList = document.querySelector('.todo-list');

  todoButton.addEventListener('click', addTodo);
  filterOption.addEventListener('change', filterTodo);
  
  getTodos();
  buildDropdownFilterOptions();
}