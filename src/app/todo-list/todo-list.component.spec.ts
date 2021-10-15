import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { TodoItem } from '../model/todo-item';
import { SearchService } from '../services/search.service';
import { LoadingService } from '../services/loading.service';
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
    { id: 3, title: "Do the dishes.", completed: true, editing: true }
  ];

  beforeEach(async () => {
    mockSearchService = jasmine.createSpyObj<SearchService>(['search', 'reset']);
    mockTodoService = jasmine.createSpyObj<TodoService>(['createTodoItem', 'updateTodoItem', 'deleteTodoItem']);
    mockTodoService.createTodoItem.and.returnValue(of({ id: 4, title: 'Created item.', completed: false, editing: false }));
    mockTodoService.updateTodoItem.and.returnValue(of(ITEMS[0]));
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
        LoadingService
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
    initListData(ITEMS);
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

    addNew();

    expect(fixture.componentInstance.addTodoItem).toHaveBeenCalledTimes(1);
  });

  it('should add new empty item when the add button is pressed', () => {
    addNew();

    const todoItemComponents = de.queryAll(By.directive(TodoItemComponent));
    const lastTodoItemComponent = todoItemComponents[todoItemComponents.length - 1];
    expect(todoItemComponents.length).toBe(ITEMS.length + 1);
    expect(lastTodoItemComponent.componentInstance.item.id).toBe(0);
    expect(lastTodoItemComponent.componentInstance.item.title).toEqual('');
  });

  it('should call completeEdit(item) when a check button is pressed', fakeAsync(() => {
    spyOn(fixture.componentInstance, 'completeEdit');
    const todoItemComponents = de.queryAll(By.directive(TodoItemComponent));

    completeEdit(todoItemComponents[0]);

    expect(fixture.componentInstance.completeEdit).toHaveBeenCalledOnceWith(ITEMS[0]);
  }));

  it('should call cancelEdit(item) when a cancel button is pressed', fakeAsync(() => {
    spyOn(fixture.componentInstance, 'cancelEdit');
    const todoItemComponents = de.queryAll(By.directive(TodoItemComponent));

    cancelEdit(todoItemComponents[0]);

    expect(fixture.componentInstance.cancelEdit).toHaveBeenCalledOnceWith(ITEMS[0]);
  }));

  it('should call delete(item) when a delete button is pressed', fakeAsync(() => {
    spyOn(fixture.componentInstance, 'delete');
    const todoItemComponents = de.queryAll(By.directive(TodoItemComponent));

    deleteItem(todoItemComponents[0]);

    expect(fixture.componentInstance.delete).toHaveBeenCalledOnceWith(ITEMS[0]);
  }));

  it('should remove a todo item when delete button is pressed', fakeAsync(() => {
    const todoItemComponents = de.queryAll(By.directive(TodoItemComponent));

    deleteItem(todoItemComponents[0]);

    expect(de.queryAll(By.directive(TodoItemComponent)).length).toBe(ITEMS.length - 1);
    expect(component.pagedTodoList.length).toBe(ITEMS.length - 1);
  }));

  describe('when item is existing one', () => {

    beforeEach(fakeAsync(() => {
      initListData(ITEMS);
    }));

    it('should update item when an existing item\'s check button is pressed', fakeAsync(() => {
      const todoItemComponents = de.queryAll(By.directive(TodoItemComponent));

      completeEdit(todoItemComponents[2]);

      expect(component.pagedTodoList.length).toBe(ITEMS.length);
      expect(mockTodoService.updateTodoItem).toHaveBeenCalledOnceWith(ITEMS[2]);
    }));

    it('should enter edit mode when an edit button is pressed', fakeAsync(() => {
      const todoItemComponents = de.queryAll(By.directive(TodoItemComponent));
      expect(fixture.componentInstance.pagedTodoList.pageData[0].editing).toBeFalsy();

      startEdit(todoItemComponents[0]);

      expect(fixture.componentInstance.pagedTodoList.pageData[0].editing).toBeTrue();
    }));

    it('should exit edit mode when a cancel button is pressed', fakeAsync(() => {
      const todoItemComponents = de.queryAll(By.directive(TodoItemComponent));
      startEdit(todoItemComponents[0]);

      cancelEdit(todoItemComponents[0]);

      expect(fixture.componentInstance.pagedTodoList.pageData[0].editing).toBeFalse();
    }));

    it('should remove item by calling todoService.deleteTodoItem() on delete', fakeAsync(() => {
      let todoItemComponents = de.queryAll(By.directive(TodoItemComponent));

      deleteItem(todoItemComponents[0]);

      todoItemComponents = de.queryAll(By.directive(TodoItemComponent));
      expect(todoItemComponents.length).toBe(ITEMS.length - 1);
      expect(mockTodoService.deleteTodoItem).toHaveBeenCalledOnceWith(ITEMS[0].id);
    }));
  });

  describe('when item is new and empty', () => {
    const ITEMS_WITH_NEW: TodoItem[] = [...ITEMS, { id: 0, title: '', completed: false, editing: true }];
    const NEW_ITEM_INDEX = 3;

    beforeEach(fakeAsync(() => {
      initListData(ITEMS_WITH_NEW);
    }));

    it('should not add more new/empty items when add button is pressed', () => {
      addNew();

      const todoItemComponents = de.queryAll(By.directive(TodoItemComponent));
      expect(todoItemComponents.length).toBe(ITEMS_WITH_NEW.length);
    });

    it('should call todoService.createTodoItem() when the item\'s check button is pressed', fakeAsync(() => {
      const todoItemComponents = de.queryAll(By.directive(TodoItemComponent));

      completeEdit(todoItemComponents[NEW_ITEM_INDEX]);

      expect(mockTodoService.createTodoItem).toHaveBeenCalledOnceWith(ITEMS_WITH_NEW[NEW_ITEM_INDEX]);
    }));

    it('should remove new item on cancel', fakeAsync(() => {
      let todoItemComponents = de.queryAll(By.directive(TodoItemComponent));

      cancelEdit(todoItemComponents[NEW_ITEM_INDEX]);

      todoItemComponents = de.queryAll(By.directive(TodoItemComponent));
      expect(todoItemComponents.length).toBe(ITEMS_WITH_NEW.length - 1);
    }));

    it('should remove new item without calling todoService.deleteTodoItem() on delete', fakeAsync(() => {
      let todoItemComponents = de.queryAll(By.directive(TodoItemComponent));

      deleteItem(todoItemComponents[NEW_ITEM_INDEX]);

      todoItemComponents = de.queryAll(By.directive(TodoItemComponent));
      expect(todoItemComponents.length).toBe(ITEMS_WITH_NEW.length - 1);
      expect(mockTodoService.deleteTodoItem).toHaveBeenCalledTimes(0);
    }));

  });

  function initListData(items: TodoItem[]) {
    mockSearchService.searchResults$ = of([...items]);
    component.ngOnInit();
    fixture.detectChanges();
    flush();
  }

  function addNew() {
    const addButton: HTMLHtmlElement = de.queryAll(By.css('button'))[1].nativeElement;
    addButton.click();
    fixture.detectChanges();
  }

  function startEdit(component: DebugElement) {
    const editButton: HTMLHtmlElement = component.queryAll(By.css('button'))[0].nativeElement;
    editButton.click();
    fixture.detectChanges();
    flush();
  }

  function cancelEdit(component: DebugElement) {
    (<TodoItemComponent>component.componentInstance).cancelItemEdit();
    fixture.detectChanges();
    flush();
  }

  function completeEdit(component: DebugElement) {
    (<TodoItemComponent>component.componentInstance).completeItemEdit();
    fixture.detectChanges();
    flush();
  }

  function deleteItem(component: DebugElement) {
    (<TodoItemComponent>component.componentInstance).deleteItem();
    fixture.detectChanges();
    flush();
  }

});
