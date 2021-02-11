class Main {

  // clas variables / properties

  // class type vars
  modelClass
  localStorageClass;
  filterTodosClass;
  createElementsClass;

  // vars
  todoInputcrea
  todoButton
  filterOption
  todoButton
  filterOption

  STATES = {
    COMPLETED: 1,
    CANT_FIX: 2
  }


  constructor() {
    this.localStorageClass = new MyLocalStorage();
    this.modelClass = new ModelTodos();
    this.filterTodosClass = new FilterTodosClass();
    this.createElementsClass = new CreateElementsClass();
    this.initPropertiesFromDom();
  };
  initPropertiesFromDom() {

    //select DOM
    this.todoInput = document.querySelector('.todo-input');
    this.todoButton = document.querySelector('.todo-button');
    this.filterOption = document.querySelector('.filter-todo');

    // javasript this issue scoping hack
    // javascript shortcomings
    this.addTodo = this.addTodo.bind(this);
    this.filterTodo = this.filterTodo.bind(this);
    this.handlerClickCompletedButton = this.handlerClickCompletedButton.bind(this);
    this.handlerClickTrashButton = this.handlerClickTrashButton.bind(this);
    this.handlerClickCantFixButton = this.handlerClickCantFixButton.bind(this);
    // end hack

    this.todoButton.addEventListener('click', this.addTodo);
    this.filterOption.addEventListener('change', this.filterTodo);

    const listFromStorage = this.localStorageClass.getTodos();
    this.createElementsClass.createElementsFromStorageList(
      this.modelClass,
      this.STATES,
      listFromStorage,
      this.toggleCompleted,
      this.toggleCantFix,
      this.handlerClickCompletedButton,
      this.handlerClickTrashButton,
      this.handlerClickCantFixButton
    );
    this.filterTodosClass.buildDropdownFilterOptions();
  };

  addTodo() {
    const curTime = new Date().getTime();
    const todoText = this.todoInput.value;
    const newId = this.modelClass.addToModel(todoText, curTime);
    this.todoInput.value = '';
    this.createElementsClass.createAndShowElementOnDom(todoText, newId, curTime);
    let modelToSave = this.modelClass.prepareModelForSaving()
    this.localStorageClass.saveTheUpdatedModel(modelToSave);
  }
  filterTodo(e) {
    let index = e.target.selectedIndex;
    this.filterTodosClass.filterByIndex(index);
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