
let todoInput;
let todoButton;
let todoList;
let filterOption;

const filterDropdownOptions = [
  { text: 'All', clickAction: filterTodoAll },
  { text: 'Completed', clickAction: filterTodoCompleted },
  { text: 'Not Yet Completed', clickAction: filterTodoUnCompleted }
];

//Event Listeners
document.addEventListener('DOMContentLoaded', DOMisReady);

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

//Functions 
function addTodo(event) {
  //Prevent form from submitting
  todoDiv.classList.add('todo');
  //Create LI
  const newTodo = document.createElement('li');
  newTodo.innerText = todoInput.value;
  newTodo.classList.add('todo-item');
  todoDiv.appendChild(newTodo);
  //Add todo to local 
  saveLocalTodos(todoInput.value);
  createCompletedButton(todoDiv);
  createTrashButton(todoDiv);
  //Clear Todo input value
  todoInput.value = '';
}


function filterTodo(e) {
  let index = e.target.selectedIndex;
  let objectInArray = filterDropdownOptions[index];
  objectInArray.clickAction();
}

function saveLocalTodos(todo) {
  let todos;
  if (localStorage.getItem('todos') === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem('todos'));
  }
  todos.push(todo);
  localStorage.setItem('todos', JSON.stringify(todos));
}
function removeLocalTodos(todoText) {
  let todos;
  if (localStorage.getItem('todos') === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.splice(todos.indexOf(todoText), 1);
  localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
  let todos;
  if (localStorage.getItem('todos') === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem('todos'));
  }
  todos.forEach(function (todo) {
    //Todo DIV
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');
    //Create LI
    const newTodo = document.createElement('li');
    newTodo.innerText = todo;
    newTodo.classList.add('todo-item');
    todoDiv.appendChild(newTodo);
    createCompletedButton(todoDiv);
    createTrashButton(todoDiv)
    //Append to list
    todoList.appendChild(todoDiv);
  });
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

function handlerClickCompletedButton(event) {
  const item = event.target;
  const todo = item.parentElement;
  todo.classList.toggle('completed');
}
function handlerClickTrashButton(event) {
  const item = event.target;
  const todo = item.parentElement;
  todo.classList.add('fall');
  todo.addEventListener('transitionend', function () {
    todo.remove();
  })
  removeLocalTodos(todo); 
}

function DOMisReady() {
  //select DOM
  todoInput = document.querySelector('.todo-input');
  todoButton = document.querySelector('.todo-button');
  filterOption = document.querySelector('.filter-todo');
  todoList = document.querySelector('.todo-list');

  getTodos();
  todoButton.addEventListener('click', addTodo);
  filterOption.addEventListener('change', filterTodo);

  buildDropdownFilterOptions();
}

// formatting shift option F 