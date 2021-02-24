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

  // vars
  todoButton
  filterOption
  todoButton
  filterOption

  constructor() {
    this.localStorageClass = new MyLocalStorage();
    this.modelClass = new ModelTodos();
    this.filterTodosClass = new FilterTodosClass();
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
    // end hack

    this.todoButton.addEventListener('click', this.addTodo);
    this.filterOption.addEventListener('change', this.filterTodo);

    this.loadAndCreateFromLocalStorage();
    this.filterTodosClass.buildDropdownFilterOptions();
  };

  loadAndCreateFromLocalStorage() {
    const listFromStorage = this.localStorageClass.getTodos();
    listFromStorage.forEach(item => {
      const todoItemClass = new TodoItemClass(item.text, item.time, this.modelClass, this.localStorageClass, item.state);
      this.modelClass.addToModel(todoItemClass);
    });
  }

  addTodo() {
    const todoInput = document.querySelector('.todo-input');
    const todoText = todoInput.value;
    const curTime = new Date().getTime();
    const todoItemClass = new TodoItemClass(todoText, curTime, this.modelClass, this.localStorageClass);
    this.modelClass.addToModel(todoItemClass);

    todoInput.value = '';
    let modelToSave = this.modelClass.prepareModelForSaving()
    this.localStorageClass.saveTheUpdatedModel(modelToSave);
  }
  filterTodo(e) {
    let index = e.target.selectedIndex;
    this.filterTodosClass.filterByIndex(index);
  }
}