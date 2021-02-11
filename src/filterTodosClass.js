class FilterTodosClass {
  filterDropdownOptions = [
    { text: 'All', sortFunction: this.filterTodoAll },
    { text: 'Completed', sortFunction: this.filterTodoCompleted },
    { text: 'Not Yet Completed', sortFunction: this.filterTodoUnCompleted },
    { text: 'Cant Fix', sortFunction: this.filterTodoCantFix }
  ];

  filterByIndex(index) {
    let objectInArray = this.filterDropdownOptions[index];
    objectInArray.sortFunction.call(this);
  }
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
  filterTodoAll() {
    const todoList = document.querySelector('.todo-list');
    todoList.childNodes.forEach((todo) => {
      todo.style.display = 'flex';
    });
  }
  filterTodoCompleted() {
    const todoList = document.querySelector('.todo-list');
    todoList.childNodes.forEach((todo) => {
      if (todo.classList.contains('completed')) {
        todo.style.display = 'flex';
      } else {
        todo.style.display = 'none';
      }
    });
  }
  filterTodoUnCompleted() {
    const todoList = document.querySelector('.todo-list');
    todoList.childNodes.forEach((todo) => {
      if (!todo.classList.contains('completed')) {
        todo.style.display = 'flex';
      } else {
        todo.style.display = 'none';
      }
    });
  }
  filterTodoCantFix() {
    const todoList = document.querySelector('.todo-list');
    todoList.childNodes.forEach((todo) => {
      if (todo.classList.contains('state-cantfix')) {
        todo.style.display = 'flex';
      } else {
        todo.style.display = 'none';
      }
    });
  }
}