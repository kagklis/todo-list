import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { TodoItem } from '../model/todo-item';
import { SearchService } from '../services/search.service';
import { SpinnerService } from '../services/spinner.service';
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
    { id: 1, title: "Walk the dog.", completed: true, editing: false },
    { id: 2, title: "Go to the supermarket.", completed: false, editing: false },
    { id: 3, title: "Do the dishes.", completed: true, editing: false }
  ];

  beforeEach(async () => {
    mockSearchService = jasmine.createSpyObj<SearchService>(['search', 'reset']);
    mockSearchService.searchResults$ = of([...ITEMS]);
    mockTodoService = jasmine.createSpyObj<TodoService>(['createTodoItem', 'updateTodoItem', 'deleteTodoItem']);
    mockTodoService.deleteTodoItem.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        SharedModule
      ],
      providers: [
        { provide: SearchService, useValue: mockSearchService },
        { provide: TodoService, useValue: mockTodoService },
        SpinnerService
      ],
      declarations: [
        TodoItemComponent,
        TodoListComponent
      ]
    }).compileComponents();
  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
    flush();
  }));

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

  it('should call addTodoItem() when add button is pressed', () => {
    spyOn(fixture.componentInstance, 'addTodoItem');

    const addButton: HTMLHtmlElement = de.queryAll(By.css('button'))[1].nativeElement;
    addButton.click();

    expect(fixture.componentInstance.addTodoItem).toHaveBeenCalledTimes(1);
  });

  it('should add new empty item when the add button is pressed', () => {
    const addButton: HTMLHtmlElement = de.queryAll(By.css('button'))[1].nativeElement;
    addButton.click();
    fixture.detectChanges();

    const todoItemComponents = de.queryAll(By.directive(TodoItemComponent));
    const lastTodoItemComponent = todoItemComponents[todoItemComponents.length - 1];
    expect(todoItemComponents.length).toBe(ITEMS.length + 1);
    expect(lastTodoItemComponent.componentInstance.item.id).toBe(0);
    expect(lastTodoItemComponent.componentInstance.item.title).toEqual('');
  });

  it('should enter edit mode when an edit button is pressed', fakeAsync(() => {
    const todoItemComponents = de.queryAll(By.directive(TodoItemComponent));
    expect(fixture.componentInstance.pagedTodoList.pageData[0].editing).toBeFalsy();

    const editButton: HTMLHtmlElement = todoItemComponents[0].queryAll(By.css('button'))[0].nativeElement;
    editButton.click();
    fixture.detectChanges();
    flush();

    expect(fixture.componentInstance.pagedTodoList.pageData[0].editing).toBeTrue();
  }));

  it('should call completeEdit(item) when a check button is pressed', fakeAsync(() => {
    spyOn(fixture.componentInstance, 'completeEdit');
    const todoItemComponents = de.queryAll(By.directive(TodoItemComponent));

    (<TodoItemComponent>todoItemComponents[0].componentInstance).completeItemEdit();
    fixture.detectChanges();
    flush();

    expect(fixture.componentInstance.completeEdit).toHaveBeenCalledOnceWith(ITEMS[0]);
  }));

  it('should create item when a new item\'s check button is pressed', fakeAsync(() => {
    const newItem = { id: 0, title: 'New todo item.', completed: false, editing: true};
    mockSearchService.searchResults$ = of([...ITEMS, newItem]);
    component.ngOnInit();
    fixture.detectChanges();
    flush();

    const todoItemComponents = de.queryAll(By.directive(TodoItemComponent));
    (<TodoItemComponent>todoItemComponents[3].componentInstance).completeItemEdit();
    fixture.detectChanges();
    flush();

    expect(component.pagedTodoList.length).toBe(ITEMS.length + 1);
    expect(mockTodoService.createTodoItem).toHaveBeenCalledOnceWith(newItem);
  }));

  it('should exit edit mode when a check button is pressed', fakeAsync(() => {
    const todoItemComponents = de.queryAll(By.directive(TodoItemComponent));
    (<TodoItemComponent>todoItemComponents[0].componentInstance).startItemEdit();
    fixture.detectChanges();

    (<TodoItemComponent>todoItemComponents[0].componentInstance).completeItemEdit();
    fixture.detectChanges();
    flush();

    expect(fixture.componentInstance.pagedTodoList.pageData[0].editing).toBeFalse();
  }));

  it('should call cancelEdit(item) when a cancel button is pressed', fakeAsync(() => {
    spyOn(fixture.componentInstance, 'cancelEdit');
    const todoItemComponents = de.queryAll(By.directive(TodoItemComponent));

    (<TodoItemComponent>todoItemComponents[0].componentInstance).cancelItemEdit();
    fixture.detectChanges();
    flush();

    expect(fixture.componentInstance.cancelEdit).toHaveBeenCalledOnceWith(ITEMS[0]);
  }));

  it('should exit edit mode when a cancel button is pressed', fakeAsync(() => {
    const todoItemComponents = de.queryAll(By.directive(TodoItemComponent));
    (<TodoItemComponent>todoItemComponents[0].componentInstance).startItemEdit();
    fixture.detectChanges();

    (<TodoItemComponent>todoItemComponents[0].componentInstance).cancelItemEdit();
    fixture.detectChanges();
    flush();

    expect(fixture.componentInstance.pagedTodoList.pageData[0].editing).toBeFalse();
  }));


  it('should call delete(item) when a delete button is pressed', () => {
    spyOn(fixture.componentInstance, 'delete');
    const todoItemComponents = de.queryAll(By.directive(TodoItemComponent));

    (<TodoItemComponent>todoItemComponents[0].componentInstance).deleteItem();
    fixture.detectChanges();

    expect(fixture.componentInstance.delete).toHaveBeenCalledOnceWith(ITEMS[0]);
  });

  it('should remove a todo item when delete button is pressed', fakeAsync(() => {
    const todoItemComponents = de.queryAll(By.directive(TodoItemComponent));

    (<TodoItemComponent>todoItemComponents[0].componentInstance).deleteItem();
    fixture.detectChanges();
    flush();

    expect(de.queryAll(By.directive(TodoItemComponent)).length).toBe(ITEMS.length - 1);
    expect(component.pagedTodoList.length).toBe(ITEMS.length - 1);
  }));

});
