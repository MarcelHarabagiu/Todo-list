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
    listOfTodoFromStorage.forEach( item => {
      const newId = modelClass.addToModel(item.text, item.time, item.state);
      const todoElement = this.createAndShowElementOnDom(item.text, newId, item.time, handlerClickCompletedButton, handlerClickTrashButton, handlerClickCantFixButton);
      if (item.state === states.COMPLETED) {
        toggleCompleted(todoElement);
      }
      if (item.state === states.CANT_FIX) {
        toggleCantFix(todoElement);
      }
    });
  }
  createAndShowElementOnDom(text, id, time, handlerClickCompletedButton, handlerClickTrashButton, handlerClickCantFixButton) {
    const todoList = document.querySelector('.todo-list');
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');
    const newTodo = document.createElement('li');
    const timeElement = document.createElement('div');

    let curTime = new Date();
    let oldTime = new Date(time);
    let deltaTime = curTime - oldTime; // number
    let deltaDate = new Date(deltaTime);

    // or
    // new Date(new Date() - new Date(deltaTime))

    timeElement.innerText = `(${deltaDate.getMinutes()} min old)`;
    newTodo.innerText = text;
    newTodo.classList.add('todo-item');
    todoDiv.setAttribute('modelid', id);
    todoDiv.appendChild(newTodo);
    todoDiv.appendChild(timeElement);
    todoList.appendChild(todoDiv);
    this.createCompletedButton(todoDiv, handlerClickCompletedButton);
    this.createTrashButton(todoDiv, handlerClickTrashButton);
    this.createCantFixButton(todoDiv, handlerClickCantFixButton);
    return todoDiv;
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
}