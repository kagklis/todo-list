import { NgModule } from '@angular/core';
import { AutofocusFixModule } from 'ngx-autofocus-fix';

import { TodoListComponent } from './todo-list.component';
import { TodoItemComponent } from './todo-item/todo-item.component';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    TodoItemComponent,
    TodoListComponent
  ],
  imports: [
    AutofocusFixModule.forRoot(),
    SharedModule
  ],
  exports: [
    TodoListComponent
  ]
})
export class TodoListModule { }
