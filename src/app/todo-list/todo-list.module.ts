import { NgModule } from '@angular/core';
import { AutofocusFixModule } from 'ngx-autofocus-fix';

import { TodoListComponent } from './todo-list.component';
import { TodoItemComponent } from './todo-item/todo-item.component';

import { SharedModule } from '../shared/shared.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SkeletonItemComponent } from './todo-item/skeleton-item.component';

@NgModule({
  declarations: [
    SkeletonItemComponent,
    TodoItemComponent,
    TodoListComponent
  ],
  imports: [
    NgxSkeletonLoaderModule,
    AutofocusFixModule.forRoot(),
    SharedModule
  ],
  exports: [
    TodoListComponent
  ]
})
export class TodoListModule { }
