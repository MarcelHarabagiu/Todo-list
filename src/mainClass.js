/**
 * Ionut todo
 *
 *
 *
    // code where i create the todo elements (input, complete, delete, cant fix)
    [].forEach(() => {
      new TodoItem(parent)
    })

    craete a new class for EACH of the todo elements

    when you need to create a new todo (view - dom)
    all you need to do is instantiate a new class

    new TodoItemClass(arguments) // this will be expanded to keep track of the id, its entry in the local storage... etc...
                      arguments is whatever the TodoItem class needs... this could be the ModelClass, LocalStorageClass, CreateElementsClass, the div parent... whatever...
 */


class Main {

  // clas variables / properties

  // class type vars
  modelClass
  localStorageClass;
  filterTodosClass;
  createElementsClass;
  handlersClass;

  // vars
  todoButton
  filterOption
  todoButton
  filterOption

  STATES_DELETE_ME = { // todo remove this once load from storage is done
    COMPLETED: 1,
    CANT_FIX: 2
  }


  constructor() {
    this.localStorageClass = new MyLocalStorage();
    this.modelClass = new ModelTodos();
    this.filterTodosClass = new FilterTodosClass();
    this.createElementsClass = new CreateElementsClass();
    this.handlersClass = new HandlersClass();
    this.initPropertiesFromDom();
  };
  initPropertiesFromDom() {

    //select DOM
    this.todoButton = document.querySelector('.todo-button');
    this.filterOption = document.querySelector('.filter-todo');

    // javasript this issue scoping hack
    // javascript shortcomings
    this.addTodo = this.addTodo.bind(this);
    this.filterTodo = this.filterTodo.bind(this);
    this.handlersClass.handlerClickCompletedButton = this.handlersClass.handlerClickCompletedButton.bind(this);
    this.handlersClass.handlerClickTrashButton = this.handlersClass.handlerClickTrashButton.bind(this);
    this.handlersClass.handlerClickCantFixButton = this.handlersClass.handlerClickCantFixButton.bind(this);
    // end hack

    this.todoButton.addEventListener('click', this.addTodo);
    this.filterOption.addEventListener('change', this.filterTodo);

    const listFromStorage = this.localStorageClass.getTodos();
    this.createElementsClass.createElementsFromStorageList(
      this.modelClass,
      this.STATES_DELETE_ME,
      listFromStorage,
      this.toggleCompleted,
      this.toggleCantFix,
      this.handlersClass.handlerClickCompletedButton,
      this.handlersClass.handlerClickTrashButton,
      this.handlersClass.handlerClickCantFixButton
    );
    this.filterTodosClass.buildDropdownFilterOptions();
  };

  addTodo() {
    const todoInput = document.querySelector('.todo-input');
    const todoText = todoInput.value;
    const curTime = new Date().getTime();
    const todoItemClass = new TodoItemClass(todoText, curTime);
    const newId = this.modelClass.addToModel(todoItemClass);
    todoItemClass.setId(newId);

    todoInput.value = '';
    // this.createElementsClass.createAndShowElementOnDom(todoText, newId, curTime);
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
  updateModelItemState(clickEvent, state) {
    const modelId = this.getIdFromEvent(clickEvent);
    const itemClassInModel = this.modelClass.getTodoItemClassById(modelId);
    itemClassInModel.setState(state);
  }
  animateElementAway(element) {
    element.classList.add('fall');
    element.addEventListener('transitionend', function () {
      element.remove();
    });
  }
}