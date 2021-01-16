
let todoInput;
let todoButton;
let todoList;
let filterOption;


// let document = {
//   eventName: null,
//   callback: null,
//   addEventListener(eventName, callback) {
//     this.eventName = eventName;
//     this.callback = callback;
//   },
//   magicFunctionYouCantSeeEventSoDontTry(hiddenMagicEventOccured) {
//     if (hiddenMagicEventOccured === 'DOMContentLoaded') {
//       this.callback(event);
//     }
//   }
// }


//Event Listeners
document.addEventListener("DOMContentLoaded", DOMisReady);

//Functions 
function addTodo(event) {
  //Prevent form from submitting
  event.preventDefault();
  //Todo DIV
  const todoDiv = document.createElement('div');
  todoDiv.classList.add('todo');
  //Create LI
  const newTodo = document.createElement("li");
  newTodo.innerText = todoInput.value;
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);
  //Add todo to local 
  // saveLocalTodos(todoInput.value);
  //Check Mark Button
  const completedButton = document.createElement("button");
  completedButton.innerHTML = '<i class="fas fa-check"></i>';
  completedButton.classList.add("completed-btn");
  todoDiv.appendChild(completedButton);
  // completedButton.innerHTML = '<i class="fas fa-check"></i>';
  const icon = document.createElement('i')
  icon.classList.add("fas");
  icon.classList.add("fa-check");
  completedButton.appendChild(icon);
  //Check Trash Button
  const trashButton = document.createElement('button');
  trashButton.innerHTML = '<i class="fas fa-trash"></i>';
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);
  //Append to list
  todoList.appendChild(todoDiv);
  //Clear Todo input value
  todoInput.value = ""
}

function deleteCheck(e) {
  const item = e.target;
  // console.log(e.target);
  //delete todo
  if (item.classList[0] === "trash-btn") {
  if (item.classList[0] === 'trash-btn') {
    const todo = item.parentElement;
    //Animation
    todo.classList.add('fall');
    todo.addEventListener('transitionend', function () {
      todo.remove();
    })
    removeLocalTodos(todo); 
  }
  //Check mark
  if (item.classList[0] === "completed-btn") {
    const todo = item.parentElement;
    todo.classList.toggle('completed');
  }
  
}

function filterTodo(e) {
  const todos = todoList.childNodes;
  todos.forEach(function (todo) {
    switch (e.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        // break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        // break;
      case "asdfomwe":
        
    }
  });
}


function saveLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}
function removeLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  const todoText = todo.children[0].innerText; // fucking stupid

  let orderInArray = todos.indexOf(todoText); // actual integer position representing order in list
  let howManyItemsInArrayToDelete = 1;

  todos.splice(orderinArray, howManyItemsInArrayToDelete);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.forEach(function (todo) {
    //Todo DIV
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');
    //Create LI
    const newTodo = document.createElement("li");
    newTodo.innerText = todo;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    //Check Mark Button
    const completedButton = document.createElement("button");
    completedButton.classList.add("completed-btn");
    todoDiv.appendChild(completedButton);
    // completedButton.innerHTML = '<i class="fas fa-check"></i>';
    const icon = document.createElement('i')
    icon.classList.add("fas");
    icon.classList.add("fa-check");
    completedButton.appendChild(icon);    
    //Check Trash Button
    const trashButton = document.createElement('button');
    trashButton.classList.add("trash-btn");
    // trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    const iconTrashButton = document.createElement('iconTrashButton')
    iconTrashButton.classList.add("fas");
    iconTrashButton.classList.add("fa-trash"); 
    trashButton.appendChild(iconTrashButton);   

    todoDiv.appendChild(trashButton);
    //Append to list
    todoList.appendChild(todoDiv);
  });
}

function DOMisReady() {
  //select DOM
  todoInput = document.querySelector('.todo-input');
  todoButton = document.querySelector('.todo-button');
  todoList = document.querySelector('.todo-list');
  filterOption = document.querySelector('.filter-todo');

  getTodos();
  todoButton.addEventListener('click', addTodo);
  todoList.addEventListener('click', deleteCheck);
  filterOption.addEventListener('change', filterTodo);
}

// formatting shift option F 