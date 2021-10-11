import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutofocusFixModule } from 'ngx-autofocus-fix';

import { TodoListComponent } from './todo-list.component';
import { TodoItemComponent } from './todo-item/todo-item.component';

import { MaterialModule } from '../shared/material.module';

@NgModule({
  declarations: [
    TodoItemComponent,
    TodoListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AutofocusFixModule.forRoot(),
    MaterialModule
  ],
  exports: [
    TodoListComponent
  ]
})
export class TodoListModule { }
