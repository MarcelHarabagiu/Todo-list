class TodoItemClass {
  STATES = {
    COMPLETED: 1,
    CANT_FIX: 2
  }

  id;
  text;
  time;
  state;
  elementTodoContainer;
  modelClass;
  localStorageClass;

  constructor(text, time, modelClass, localStorageClass) {
    this.text = text;
    this.time = time;
    this.modelClass = modelClass;
    this.localStorageClass = localStorageClass;
    this.bindHandlersToThis();
  }
  bindHandlersToThis() {
    this.handlerClickCompletedButton = this.handlerClickCompletedButton.bind(this);
    this.handlerClickTrashButton = this.handlerClickTrashButton.bind(this);
    this.handlerClickCantFixButton = this.handlerClickCantFixButton.bind(this);
  }
  setId(id) {
    this.id = id;
    this.createElements();
    this.updateStateView();
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
  doesIdMatch(id) {
    return this.id === id;
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
    this.elementTodoContainer.setAttribute('modelid', this.id); // this is where we link these elements on the page with the model - the ID is the same as in the model (todo array)
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
    const item = event.target;
    const todo = item.parentElement;

    this.updateModelItemState(event, this.STATES.COMPLETED);
    let modelToSave = this.modelClass.prepareModelForSaving()
    this.localStorageClass.saveTheUpdatedModel(modelToSave);
  }
  handlerClickTrashButton(event) {
    const item = event.target;
    const todo = item.parentElement;
    const modelId = this.getIdFromEvent(event);
    const itemClassInModel = this.modelClass.getTodoItemClassById(modelId);
    // todo finish item animation
    if (itemClassInModel) {
      this.animateElementAway(todo);
      this.modelClass.removeFromModel(itemClassInModel);
      let modelToSave = this.modelClass.prepareModelForSaving()
      this.localStorageClass.saveTheUpdatedModel(modelToSave);
    } else {
      console.log('we fucked up finding the item in the model correctly');
    }
  }
  handlerClickCantFixButton(event) {
    const item = event.target;
    const todo = item.parentElement;
    this.updateModelItemState(event, this.STATES.CANT_FIX);
    let modelToSave = this.modelClass.prepareModelForSaving()
    this.localStorageClass.saveTheUpdatedModel(modelToSave);
  }
  updateModelItemState(clickEvent, state) {
    const modelId = this.getIdFromEvent(clickEvent);
    const itemClassInModel = this.modelClass.getTodoItemClassById(modelId);
    itemClassInModel.setState(state);
  }
  getIdFromEvent(clickEvent) {
    const item = clickEvent.target;
    const todo = item.parentElement;
    const modelId = todo.getAttribute('modelid'); // this is a string
    return Number(modelId);
  }
  animateElementAway(element) {
    element.classList.add('fall');
    element.addEventListener('transitionend', function () {
      element.remove();
    });
  }
}