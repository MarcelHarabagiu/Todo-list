class TodoItemClass {
  STATES = {
    COMPLETED: 1,
    CANT_FIX: 2
  }

  text;
  time;
  state;
  elementTodoContainer;
  modelClass;
  localStorageClass;

  constructor(text, time, modelClass, localStorageClass, state = undefined) {
    this.text = text;
    this.time = time;
    this.modelClass = modelClass;
    this.state = state;
    this.localStorageClass = localStorageClass;
    this.bindHandlersToThis();
    this.createElements();
  }
  bindHandlersToThis() {
    this.handlerClickCompletedButton = this.handlerClickCompletedButton.bind(this);
    this.handlerClickTrashButton = this.handlerClickTrashButton.bind(this);
    this.handlerClickCantFixButton = this.handlerClickCantFixButton.bind(this);
  }
  setState(state) {
    this.state = state;
    this.updateStateView();
  }
  updateStateView() {
    if (this.state && this.elementTodoContainer) {
      if (this.state === this.STATES.COMPLETED) {
        this.toggleCompleted(this.elementTodoContainer);
      }
      if (this.state === this.STATES.CANT_FIX) {
        this.toggleCantFix(this.elementTodoContainer);
      }
    }
  }
  createElements() {
    const todoList = document.querySelector('.todo-list');
    this.elementTodoContainer = document.createElement('div');
    this.elementTodoContainer.classList.add('todo');
    const newTodo = document.createElement('li');
    const timeElement = document.createElement('div');

    let curTime = new Date();
    let oldTime = new Date(this.time);
    let deltaTime = curTime - oldTime; // number
    let deltaDate = new Date(deltaTime);

    timeElement.innerText = `(${deltaDate.getMinutes()} min old)`;
    newTodo.innerText = this.text;
    newTodo.classList.add('todo-item');
    this.elementTodoContainer.appendChild(newTodo);
    this.elementTodoContainer.appendChild(timeElement);
    todoList.appendChild(this.elementTodoContainer);
    this.createCompletedButton(this.elementTodoContainer, this.handlerClickCompletedButton);
    this.createTrashButton(this.elementTodoContainer, this.handlerClickTrashButton);
    this.createCantFixButton(this.elementTodoContainer, this.handlerClickCantFixButton);
  }
  toggleCompleted(element) {
    element.classList.toggle('completed');
  }
  toggleCantFix(element) {
    element.classList.toggle('state-cantfix');
  }
  createCompletedButton(todoDiv, handlerClickCompletedButton) {
    const completedButton = document.createElement('button');
    completedButton.addEventListener('click', handlerClickCompletedButton);
    completedButton.classList.add('completed-btn');
    todoDiv.appendChild(completedButton);
    const icon = document.createElement('i');
    icon.classList.add('fas', 'fa-check');
    completedButton.appendChild(icon);
  }
  createTrashButton(todoDiv, handlerClickTrashButton) {
    const trashButton = document.createElement('button');
    trashButton.addEventListener('click', handlerClickTrashButton);
    trashButton.classList.add('trash-btn');
    const iconTrashButton = document.createElement('iconTrashButton');
    iconTrashButton.classList.add('fas', 'fa-trash');
    trashButton.appendChild(iconTrashButton);
    todoDiv.appendChild(trashButton);
  }
  createCantFixButton(todoDiv, handlerClickCantFixButton) {
    const button = document.createElement('button');
    button.innerText = 'cant fix';
    button.addEventListener('click', handlerClickCantFixButton);
    todoDiv.appendChild(button);
  }

  // handlers
  handlerClickCompletedButton(event) {
    this.setState(this.STATES.COMPLETED);
    let modelToSave = this.modelClass.prepareModelForSaving()
    this.localStorageClass.saveTheUpdatedModel(modelToSave);
  }
  handlerClickTrashButton(event) {
    this.animateElementAway(this.elementTodoContainer);
    this.modelClass.removeFromModel(this);
    let modelToSave = this.modelClass.prepareModelForSaving()
    this.localStorageClass.saveTheUpdatedModel(modelToSave);
  }
  handlerClickCantFixButton(event) {
    this.setState(this.STATES.CANT_FIX);
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