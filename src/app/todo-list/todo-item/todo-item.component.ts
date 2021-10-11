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

  ngOnInit(): void { }

  toggle(item: TodoItem): void {
    if (item.id === 0) return;
    this.todoService.updateTodoItem(item).subscribe();
  }

  titleChanged(title: string, item: TodoItem) {
    if (item.id === 0) {
      item.title = title;
    }
    this.tempTitle = title;
  }

  deleteTodoItem(id: number) {
    this.deleteItem.emit(id);
  }

  editTodoItem(item: TodoItem): void {
    item.editing = true;
  }

  completeItemEdit(item: TodoItem): void {
    item.title = this.tempTitle;
    this.completeEdit.emit(item);
    this.tempTitle = '';
  }

  cancelItemEdit(item: TodoItem) {
    item.editing = false;
    this.cancelEdit.emit(item.id);
  }

}
