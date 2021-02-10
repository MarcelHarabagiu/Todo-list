class Main {

  // clas variables / properties
  myLocalStorage;
  myModel
  todoInput
  todoButton
  filterOption
  todoList
  todoButton
  filterOption
  modelTodos;

  STATES = {
    COMPLETED: 1,
    CANT_FIX: 2
  }
  filterDropdownOptions = [
    { text: 'All', sortFunction: this.filterTodoAll },
    { text: 'Completed', sortFunction: this.filterTodoCompleted },
    { text: 'Not Yet Completed', sortFunction: this.filterTodoUnCompleted },
    { text: 'Cant Fix', sortFunction: this.filterTodoCantFix }
  ];

  constructor() {
    // this.myLocalStorage = new MyLocalStorage();
    // this.myModel = new MyModel();
    this.modelTodos = [];
  };
  initPropertiesFromDom() {

    //select DOM
    this.todoInput = document.querySelector('.todo-input');
    this.todoButton = document.querySelector('.todo-button');
    this.filterOption = document.querySelector('.filter-todo');
    this.todoList = document.querySelector('.todo-list');

    // javasript this issue scoping hack
    // javascript shortcomings
    this.addTodo = this.addTodo.bind(this);
    this.filterTodo = this.filterTodo.bind(this);
    // end hack

    this.todoButton.addEventListener('click', this.addTodo);
    this.filterOption.addEventListener('change', this.filterTodo);

    const listFromStorage = this.getTodos();
    this.buildDropdownFilterOptions(listFromStorage);
  };
  getTodos() {
    let todos;
    if (localStorage.getItem('todos') === null) {
      todos = [];
    } else {
      todos = JSON.parse(localStorage.getItem('todos'));
    }

    // forEach ( current, index, array )
    todos.forEach( (item, index, array) => {
      const isFirst = index === 0;
      const isLast = index === array.length - 1;
      const newId = this.addToModel(item.text, item.time, item.state);
      const todoElement = this.createAndShowElementOnDom(item.text, newId, item.time);
      if (item.state === this.STATES.COMPLETED) {
        this.toggleCompleted(todoElement);
      }
      if (item.state === this.STATES.CANT_FIX) {
        this.toggleCantFix(todoElement);
      }
    });
  }
  buildDropdownFilterOptions() {
    const filterList = document.querySelector('.filter-todo');
    this.filterDropdownOptions.forEach(item => {
      const text = item.text;
      const optionElement = document.createElement('option');
      filterList.appendChild(optionElement);
      optionElement.text = text
      optionElement.value = text;
    });
  }
  createElementsFromStorageList() {
    listOfTodoFromStorage.forEach( item => {
      const newId = this.addToModel(item.text, item.time, item.state);
      const todoElement = this.createAndShowElementOnDom(item.text, newId, item.time);
      if (item.state === this.STATES.COMPLETED) {
        toggleCompleted(todoElement);
      }
      if (item.state === this.STATES.CANT_FIX) {
        toggleCantFix(todoElement);
      }
    });
  }
  addTodo() {
    const curTime = new Date().getTime();
    const todoText = this.todoInput.value;
    const newId = this.addToModel(todoText, curTime);
    this.todoInput.value = '';
    this.createAndShowElementOnDom(todoText, newId, curTime);
    this.saveTheUpdatedModel();
  }
  createAndShowElementOnDom(text, id, time) {
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
    this.todoList.appendChild(todoDiv);
    this.createCompletedButton(todoDiv);
    this.createTrashButton(todoDiv);
    this.createCantFixButton(todoDiv);
    return todoDiv;
  }
  filterTodo(e) {
    let index = e.target.selectedIndex;
    let objectInArray = this.filterDropdownOptions[index];
    objectInArray.sortFunction.call(this);
  }
  filterTodoAll() {
    this.todoList.childNodes.forEach((todo) => {
      todo.style.display = 'flex';
    });
  }
  filterTodoCompleted() {
    this.todoList.childNodes.forEach((todo) => {
      if (todo.classList.contains('completed')) {
        todo.style.display = 'flex';
      } else {
        todo.style.display = 'none';
      }
    });
  }
  filterTodoUnCompleted() {
    this.todoList.childNodes.forEach((todo) => {
      if (!todo.classList.contains('completed')) {
        todo.style.display = 'flex';
      } else {
        todo.style.display = 'none';
      }
    });
  }
  filterTodoCantFix() {
    this.todoList.childNodes.forEach((todo) => {
      if (todo.classList.contains('state-cantfix')) {
        todo.style.display = 'flex';
      } else {
        todo.style.display = 'none';
      }
    });
  }
  saveTheUpdatedModel(itemToRemove) {
    let modelToSave = this.filterModelForSaving(itemToRemove);
    localStorage.setItem('todos', JSON.stringify(modelToSave));
  }
  filterModelForSaving(itemToRemove) {
    const filteredModel = this.modelTodos.filter(item => item !== itemToRemove);
    const nonIdList = filteredModel.map(item => {
      return {
        text: item.text,
        time: item.time,
        state: item.state
      }
    });
    return nonIdList;
  }
  addToModel(text, time, state) {
    const isFirst = this.modelTodos.length === 0;
    const lastInList = this.modelTodos[this.modelTodos.length - 1];
    const id = isFirst ? 0 : lastInList.id + 1;
    this.modelTodos.push({ id, text, time, state }); // es6
  }
  createCantFixButton(todoDiv) {
    const button = document.createElement('button');
    button.innerText = 'cant fix';
    this.handlerClickCantFixButton = this.handlerClickCantFixButton.bind(this);
    button.addEventListener('click', this.handlerClickCantFixButton);
    todoDiv.appendChild(button);
  }
  createTrashButton(todoDiv) {
    const trashButton = document.createElement('button');
    this.handlerClickTrashButton = this.handlerClickTrashButton.bind(this);
    trashButton.addEventListener('click', this.handlerClickTrashButton);
    trashButton.classList.add('trash-btn');
    const iconTrashButton = document.createElement('iconTrashButton');
    iconTrashButton.classList.add('fas', 'fa-trash');
    trashButton.appendChild(iconTrashButton);
    todoDiv.appendChild(trashButton);
  }

  createCompletedButton(todoDiv) {
    const completedButton = document.createElement('button');
    this.handlerClickCompletedButton = this.handlerClickCompletedButton.bind(this);
    completedButton.addEventListener('click', this.handlerClickCompletedButton);
    completedButton.classList.add('completed-btn');
    todoDiv.appendChild(completedButton);
    const icon = document.createElement('i');
    icon.classList.add('fas', 'fa-check');
    completedButton.appendChild(icon);
  }

  getIdFromEvent(clickEvent) {
    const item = clickEvent.target;
    const todo = item.parentElement;
    const modelId = todo.getAttribute('modelid'); // this is a string
    return Number(modelId);
  }
  getItemInModelFromEvent(clickEvent) {
    const modelId = getIdFromEvent(clickEvent);
    const itemInModel = modelTodos.find(item => item.id === modelId);
    return itemInModel;
  }

  toggleCompleted(element) {
    element.classList.toggle('completed');
  }
  toggleCantFix(element) {
    element.classList.toggle('state-cantfix');
  }
  updateModelItemState(clickEvent, state) {
    const itemInModel = getItemInModelFromEvent(clickEvent);
    if (itemInModel.state === state) {
      itemInModel.state = undefined;
    } else {
      itemInModel.state = state;
    }
  }
  handlerClickCompletedButton(event) {
    const item = event.target;
    const todo = item.parentElement;
    toggleCompleted(todo);

    this.updateModelItemState(event, STATES.COMPLETED);
    saveTheUpdatedModel();
  }
  handlerClickTrashButton(event) {
    const item = event.target;
    const todo = item.parentElement;
    const itemInModel = getItemInModelFromEvent(event);
    if (itemInModel) {
      animateElementAway(todo);
      saveTheUpdatedModel(itemInModel);
    } else {
      console.log('we fucked up finding the item in the model correctly');
    }
  }
  handlerClickCantFixButton(event) {
    const item = event.target;
    const todo = item.parentElement;
    toggleCantFix(todo);
    this.updateModelItemState(event, STATES.CANT_FIX);
    saveTheUpdatedModel();
  }

  animateElementAway(element) {
    element.classList.add('fall');
    element.addEventListener('transitionend', function () {
      element.remove();
    });
  }
}
// END MAIN CLASS

class MyModel {
  constructor() {
  }

}
class MyLocalStorage {
}

const main = new Main();

// window.onload = main.initPropertiesFromDom; ---> scope of "this" in Main becomes the same as whats window.onload
window.onload = () => {
  main.initPropertiesFromDom();
}