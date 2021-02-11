class Main {

  // clas variables / properties

  // class type vars
  modelClass
  localStorageClass;

  // vars
  todoInput
  todoButton
  filterOption
  todoList
  todoButton
  filterOption

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
    this.localStorageClass = new MyLocalStorage();
    this.modelClass = new ModelTodos();
    this.initPropertiesFromDom();
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

    const listFromStorage = this.localStorageClass.getTodos();
    this.createElementsFromStorageList(listFromStorage);
    this.buildDropdownFilterOptions();
  };
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
  createElementsFromStorageList(listOfTodoFromStorage) {
    listOfTodoFromStorage.forEach( item => {
      const newId = this.modelClass.addToModel(item.text, item.time, item.state);
      const todoElement = this.createAndShowElementOnDom(item.text, newId, item.time);
      if (item.state === this.STATES.COMPLETED) {
        this.toggleCompleted(todoElement);
      }
      if (item.state === this.STATES.CANT_FIX) {
        this.toggleCantFix(todoElement);
      }
    });
  }
  addTodo() {
    const curTime = new Date().getTime();
    const todoText = this.todoInput.value;
    const newId = this.modelClass.addToModel(todoText, curTime);
    this.todoInput.value = '';
    this.createAndShowElementOnDom(todoText, newId, curTime);
    let modelToSave = this.modelClass.prepareModelForSaving()
    this.localStorageClass.saveTheUpdatedModel(modelToSave);
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
  toggleCompleted(element) {
    element.classList.toggle('completed');
  }
  toggleCantFix(element) {
    element.classList.toggle('state-cantfix');
  }
  updateModelItemState(clickEvent, state) {
    const modelId = this.getIdFromEvent(clickEvent);
    const itemInModel = this.modelClass.getItemInModelFromEvent(modelId);
    if (itemInModel.state === state) {
      itemInModel.state = undefined;
    } else {
      itemInModel.state = state;
    }
  }
  handlerClickCompletedButton(event) {
    const item = event.target;
    const todo = item.parentElement;
    this.toggleCompleted(todo);

    this.updateModelItemState(event, this.STATES.COMPLETED);
    let modelToSave = this.modelClass.prepareModelForSaving()
    this.localStorageClass.saveTheUpdatedModel(modelToSave);
  }
  handlerClickTrashButton(event) {
    const item = event.target;
    const todo = item.parentElement;
    const modelId = this.getIdFromEvent(event);
    const itemInModel = this.modelClass.getItemInModelFromEvent(modelId);
    if (itemInModel) {
      this.animateElementAway(todo);
      this.modelClass.removeFromModel(itemInModel);
      let modelToSave = this.modelClass.prepareModelForSaving()
      this.localStorageClass.saveTheUpdatedModel(modelToSave);
    } else {
      console.log('we fucked up finding the item in the model correctly');
    }
  }
  handlerClickCantFixButton(event) {
    const item = event.target;
    const todo = item.parentElement;
    this.toggleCantFix(todo);
    this.updateModelItemState(event, this.STATES.CANT_FIX);
    let modelToSave = this.modelClass.prepareModelForSaving()
    this.localStorageClass.saveTheUpdatedModel(modelToSave);
  }

  animateElementAway(element) {
    element.classList.add('fall');
    element.addEventListener('transitionend', function () {
      element.remove();
    });
  }
}