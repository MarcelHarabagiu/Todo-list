class MyLocalStorage {
  saveTheUpdatedModel(modelToSave) {
    localStorage.setItem('todos', JSON.stringify(modelToSave));
  }
  getTodos() {
    let todos;
    if (localStorage.getItem('todos') === null) {
      todos = [];
    } else {
      todos = JSON.parse(localStorage.getItem('todos'));
    }
    return todos;
  }
}