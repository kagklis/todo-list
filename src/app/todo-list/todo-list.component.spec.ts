import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutofocusFixModule } from 'ngx-autofocus-fix';
import { of } from 'rxjs';
import { TodoItem } from '../model/todo-item';
import { SpinnerService } from '../services/spinner.service';
import { TodoService } from '../services/todo.service';
import { MaterialModule } from '../shared/material.module';

import { TodoListComponent } from './todo-list.component';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  let mockSpinnerService;
  let mockTodoService;

  beforeEach(async () => {

    mockSpinnerService = jasmine.createSpyObj([], ['isLoading$']);
    mockTodoService = jasmine.createSpyObj(['addTodoItem', 'search', 'resetSearch'], ['todoList$', 'searchText$']);

    // await TestBed.configureTestingModule({
    //   declarations: [TodoListComponent],
    //   imports: [
    //     CommonModule,
    //     BrowserAnimationsModule,
    //     FormsModule,
    //     AutofocusFixModule.forRoot(),
    //     MaterialModule
    //   ],
    //   providers: [
    //     { provide: TodoService, useValue: mockTodoService },
    //     { provide: SpinnerService, useValue: mockSpinnerService }
    //   ]
    // }).compileComponents();


    component = new TodoListComponent(mockSpinnerService, mockTodoService);
  });

  beforeEach(() => {
    // fixture = TestBed.createComponent(TodoListComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add new todo item', done => {
    component.items$ = of([]);

    //component.addTodoItem();

   // expect(component.addTodoItem).toHaveBeenCalled();
  });

});
