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
  delete = new EventEmitter();

  @Output()
  completeEdit = new EventEmitter();

  @Output()
  cancelEdit = new EventEmitter();

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

  deleteItem() {
    this.delete.emit();
  }

  startItemEdit(): void {
    this.item.editing = true;
  }

  completeItemEdit(): void {
    this.item.title = this.tempTitle;
    this.item.editing = false;
    this.completeEdit.emit();
  }

  cancelItemEdit() {
    this.tempTitle = this.item.title;
    this.item.editing = false;
    this.cancelEdit.emit();
  }

}
