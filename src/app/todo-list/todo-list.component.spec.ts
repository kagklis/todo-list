import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { TodoItem } from '../model/todo-item';
import { SearchService } from '../services/search.service';
import { TodoService } from '../services/todo.service';
import { SharedModule } from '../shared/shared.module';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { TodoListComponent } from './todo-list.component';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let de: DebugElement;
  let mockSearchService: jasmine.SpyObj<SearchService>;
  let mockTodoService: jasmine.SpyObj<TodoService>;

  const ITEMS: TodoItem[] = [
    { id: 1, title: "Walk the dog.", completed: true },
    { id: 2, title: "Go to the supermarket.", completed: false },
    { id: 3, title: "Do the dishes.", completed: true }
  ];

  beforeEach(async () => {
    mockSearchService = jasmine.createSpyObj(['search', 'reset']);
    mockSearchService.searchResults$ = of([...ITEMS]);
    mockTodoService = jasmine.createSpyObj(['deleteTodoItem']);
    mockTodoService.deleteTodoItem.and.returnValue(of(true));
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        SharedModule
      ],
      providers: [
        { provide: SearchService, useValue: mockSearchService },
        { provide: TodoService, useValue: mockTodoService }
      ],
      declarations: [
        TodoItemComponent,
        TodoListComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all todo items', () => {
    const todoItemComponents = de.queryAll(By.directive(TodoItemComponent));

    expect(todoItemComponents.length).toBe(ITEMS.length);
    for (let i = 0; i < ITEMS.length; i++) {
      expect(todoItemComponents[i].componentInstance.item).toEqual(ITEMS[i]);
    }
  });

  it('should add a todo when add button is pressed', () => {
    const addButton: HTMLHtmlElement = de.queryAll(By.css('button'))[1].nativeElement;

    addButton.click();
    fixture.detectChanges();

    expect(de.queryAll(By.directive(TodoItemComponent)).length).toBe(ITEMS.length + 1);
    expect(component.pagedTodoList.length).toBe(ITEMS.length + 1);
  });

  it('should remove a todo item when delete button is pressed', () => {
    let todoItemComponents = de.queryAll(By.directive(TodoItemComponent));
    const deleteButton: HTMLHtmlElement = todoItemComponents[0].queryAll(By.css('button'))[1].nativeElement;

    deleteButton.click();
    fixture.detectChanges();

    expect(de.queryAll(By.directive(TodoItemComponent)).length).toBe(ITEMS.length - 1);
    expect(component.pagedTodoList.length).toBe(ITEMS.length - 1);
  });

});
