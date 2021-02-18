class CreateElementsClass {
  createElementsFromStorageList(
    modelClass,
    states,
    listOfTodoFromStorage,
    toggleCompleted,
    toggleCantFix,
    handlerClickCompletedButton,
    handlerClickTrashButton,
    handlerClickCantFixButton
  ) {
    listOfTodoFromStorage.forEach(item => {
      const todoItemClass = new TodoItemClass(item.text, item.time);
      todoItemClass.setState(item.state);
      const newId = modelClass.addToModel(todoItemClass);
      todoItemClass.setId(newId);
    });
  }
}