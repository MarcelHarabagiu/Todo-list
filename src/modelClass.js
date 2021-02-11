class ModelTodos {
  // class properties
  modelTodos

  constructor() {
    this.modelTodos = [];
  }

  removeFromModel(itemToRemove) {
    this.modelTodos = this.modelTodos.filter(item => item !== itemToRemove);
  }
  prepareModelForSaving() {
    const nonIdList = this.modelTodos.map(item => {
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
    return id;
  }
  getItemInModelFromEvent(modelId) {
    const itemInModel = this.modelTodos.find(item => item.id === modelId);
    return itemInModel;
  }
}