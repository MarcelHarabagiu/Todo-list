class ModelTodos {
  // class properties
  todoItemClasses

  constructor() {
    this.todoItemClasses = [];
  }

  removeFromModel(todoItemClass) {
    this.todoItemClasses = this.todoItemClasses.filter(item => item !== todoItemClass);
  }
  prepareModelForSaving() {
    const nonIdList = this.todoItemClasses.map(item => {
      return {
        text: item.text,
        time: item.time,
        state: item.state
      }
    });
    return nonIdList;
  }
  addToModel(todoItemClass) {
    const isFirst = this.todoItemClasses.length === 0;
    const lastInList = this.todoItemClasses[this.todoItemClasses.length - 1];
    const id = isFirst ? 0 : lastInList.id + 1;
    this.todoItemClasses.push(todoItemClass);
    return id;
  }
  getTodoItemClassById(modelId) {
    const itemInModel = this.todoItemClasses.find(item => {
      return item.doesIdMatch(modelId);
    });
    return itemInModel;
  }
}