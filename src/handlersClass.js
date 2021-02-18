/**
 * NOTE
 *
 * this is bound to the Main class this and not local scope
 */
class HandlersClass {
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
    const itemClassInModel = this.modelClass.getTodoItemClassById(modelId);
    // todo finish item animation
    if (itemClassInModel) {
      // this.animateElementAway(todo);
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
    this.toggleCantFix(todo);
    this.updateModelItemState(event, this.STATES.CANT_FIX);
    let modelToSave = this.modelClass.prepareModelForSaving()
    this.localStorageClass.saveTheUpdatedModel(modelToSave);
  }
}