import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { TodoItem } from "./todo-item";

export class TodoList {

  private _items: TodoItem[] = [];

  get items(): TodoItem[] {
    return [...this._items];
  }

  get length(): number {
    return this._items.length;
  }


  constructor(items?: TodoItem[]) {
    this._items = items ?? [];
  }


  addEmptyItem() {
    const emptyTodoExists = this._items.some(item => item.id === 0);
    if (emptyTodoExists) {
      return;
    }

    this._items.push({
      id: 0,
      title: '',
      completed: false,
      editing: true
    });
  }

  removeItemById(id: number) {
    const index = this._items.findIndex(item => item.id == id);
    if (index > -1) {
      this._items.splice(index, 1);
    }
  }


  replaceItem(oldItem: TodoItem, newItem: TodoItem) {
    const index = this._items.findIndex(item => item.id == oldItem.id);
    if (index > -1) {
      this._items.splice(index, 1, newItem);
    }
  }

  rearrangeAfterDragAndDrop(event: CdkDragDrop<TodoItem[], TodoItem[], any>) {

    // Workaround: virtual scrolling causes indexing issues when
    // combined with CdkDropList.
    const correctPreviousIndex = event.previousContainer.data.findIndex((todoItem) => todoItem.id === event.item.data.id)
    moveItemInArray(this._items, correctPreviousIndex, event.currentIndex);
  }

}
