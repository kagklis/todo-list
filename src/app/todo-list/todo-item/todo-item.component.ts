import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';
import { TodoItem } from '../../model/todo-item';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent implements OnInit {

  @Input()
  item!: TodoItem;

  @Output()
  deleteItem = new EventEmitter<number>();

  @Output()
  completeEdit = new EventEmitter<TodoItem>();

  @Output()
  cancelEdit = new EventEmitter<number>();

  tempTitle!: string;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.tempTitle = this.item.title;
  }

  toggle(item: TodoItem): void {
    item.completed = !item.completed;
    if (item.id === 0) return;
    this.todoService.updateTodoItem(item).subscribe();
  }

  onTitleChange() {
    if (this.item.id === 0) {
      this.item.title = this.tempTitle;
    }
  }

  deleteTodoItem(id: number) {
    this.deleteItem.emit(id);
  }

  startItemEdit(item: TodoItem): void {
    item.editing = true;
  }

  completeItemEdit(item: TodoItem): void {
    item.title = this.tempTitle;
    item.editing = false;
    this.completeEdit.emit(item);
  }

  cancelItemEdit(item: TodoItem) {
    this.tempTitle = item.title;
    item.editing = false;
    this.cancelEdit.emit(item.id);
  }

}
