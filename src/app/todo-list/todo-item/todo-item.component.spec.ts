import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { TodoService } from 'src/app/services/todo.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { TodoItemComponent } from './todo-item.component';

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;
  let de: DebugElement;
  let mockTodoService: jasmine.SpyObj<TodoService>;

  beforeEach(async () => {
    mockTodoService = jasmine.createSpyObj(['updateTodoItem']);
    mockTodoService.updateTodoItem.and.returnValue(of({ id: 1, title: '', completed: true, editing: false }));

    await TestBed.configureTestingModule({
      imports: [
        SharedModule
      ],
      declarations: [TodoItemComponent],
      providers: [
        { provide: TodoService, useValue: mockTodoService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct item', () => {
    component.item = { id: 1, title: 'Sample to-do item.', completed: false, editing: false };

    expect(component.item.id).toBe(1);
  });

  it('should render the item in view mode correctly', () => {
    component.item = { id: 1, title: 'Sample to-do item.', completed: true, editing: false };
    fixture.detectChanges();

    expect(de.query(By.directive(MatCheckbox)).componentInstance.checked).toBeTrue();
    expect(de.query(By.directive(MatLabel)).nativeElement.textContent).toContain('Sample to-do item.');

    const icons = de.queryAll(By.directive(MatIcon));
    expect(icons[0].nativeElement.textContent).toEqual('edit');
    expect(icons[1].nativeElement.textContent).toEqual('delete');
  });

  it('should render the item in edit mode correctly', () => {
    component.item = { id: 1, title: 'Sample to-do item.', completed: false, editing: true };
    fixture.detectChanges();

    expect(de.query(By.directive(MatCheckbox)).componentInstance.checked).toBeFalse();
    expect(de.query(By.css('input')).nativeElement).toBeTruthy();

    const icons = de.queryAll(By.css('mat-icon'));
    expect(icons[0].nativeElement.textContent).toEqual('check');
    expect(icons[1].nativeElement.textContent).toEqual('close');
  });

  it('should change tempTitle for new items when typing', () => {
    component.item = { id: 0, title: 'Sample to-do item.', completed: false, editing: true };
    fixture.detectChanges();
    const input: HTMLInputElement = de.query(By.css('input.todo-input')).nativeElement;

    input.value = 'New value';
    input.dispatchEvent(new Event('input'));

    expect(component.tempTitle).toEqual('New value');
  });

  it('should update existing item when checkbox is toggled', () => {
    component.item = { id: 1, title: 'Sample to-do item.', completed: false, editing: true };
    fixture.detectChanges();
    let checkboxDebugElement = de.query(By.directive(MatCheckbox));
    let labelElement = <HTMLLabelElement>checkboxDebugElement.nativeElement.querySelector('label');

    labelElement.click();
    fixture.detectChanges();

    expect(checkboxDebugElement.componentInstance.checked).toBeTrue();
    expect(mockTodoService.updateTodoItem).toHaveBeenCalledTimes(1);
  });

  it('should not update new item when checkbox is toggled', () => {
    component.item = { id: 0, title: 'Sample to-do item.', completed: false, editing: true };
    fixture.detectChanges();
    let checkboxDebugElement = de.query(By.directive(MatCheckbox));
    let labelElement = <HTMLLabelElement>checkboxDebugElement.nativeElement.querySelector('label');

    labelElement.click();
    fixture.detectChanges();

    expect(checkboxDebugElement.componentInstance.checked).toBeTrue();
    expect(mockTodoService.updateTodoItem).toHaveBeenCalledTimes(0);
  });

  it('should not update new item when checkbox is toggled', () => {
    const item = { id: 0, title: 'Sample to-do item.', completed: false };
    component.item = { ...item };
    fixture.detectChanges();

    component.toggle();

    expect(component.item.completed).toBe(!item.completed);
    expect(mockTodoService.updateTodoItem).toHaveBeenCalledTimes(0);
  });

  it('should emit a delete event', () => {
    spyOn(component.delete, 'emit');
    component.item = { id: 1, title: 'Sample to-do item.', completed: false, editing: false };
    fixture.detectChanges();
    const deleteButton: HTMLElement = de.queryAll(By.css('button'))[1].nativeElement;

    deleteButton.click();
    fixture.detectChanges();

    expect(component.delete.emit).toHaveBeenCalledTimes(1);
  });

  it('should enter edit mode', () => {
    component.item = { id: 1, title: 'Sample to-do item.', completed: false, editing: false };
    fixture.detectChanges();
    const editButton: HTMLElement = de.queryAll(By.css('button'))[0].nativeElement;

    editButton.click();
    fixture.detectChanges();

    expect(component.item.editing).toBeTrue();
  });

  describe('on complete edit', () => {
    let checkButton: HTMLElement;
    beforeEach(() => {
      component.item = { id: 1, title: 'Sample to-do item.', completed: false, editing: true };
      fixture.detectChanges();
      checkButton = de.queryAll(By.css('button'))[0].nativeElement;
    });

    it('should change title on complete edit', () => {
      spyOn(component.completeEdit, 'emit');
      const input: HTMLInputElement = de.query(By.css('input.todo-input')).nativeElement;

      input.value = 'New value';
      input.dispatchEvent(new Event('input'));
      checkButton.click();
      fixture.detectChanges();

      expect(component.item.title).toEqual('New value');
    });

    it('should exit edit mode on complete edit', () => {
      spyOn(component.completeEdit, 'emit');

      checkButton.click();
      fixture.detectChanges();

      expect(component.item.editing).toBeFalse();
    });

    it('should emit completeItem on complete edit', () => {
      spyOn(component.completeEdit, 'emit');

      checkButton.click();
      fixture.detectChanges();

      expect(component.item.editing).toBeFalse();
    });
  });

  describe('on cancel edit', () => {

    let cancelButton: HTMLElement;
    beforeEach(() => {
      component.item = { id: 1, title: 'Sample to-do item.', completed: false, editing: true };
      fixture.detectChanges();
      cancelButton = de.queryAll(By.css('button'))[1].nativeElement;
    });

    it('should emit cancelEdit event', () => {
      spyOn(component.cancelEdit, 'emit');

      cancelButton.click();
      fixture.detectChanges();

      expect(component.cancelEdit.emit).toHaveBeenCalledTimes(1);
    });

    it('should exit edit mode', () => {
      cancelButton.click();
      fixture.detectChanges();

      expect(component.item.editing).toBeFalse();
    });

    it('should revert text changes', () => {
      const input: HTMLInputElement = de.query(By.css('input.todo-input')).nativeElement;
      input.value = 'New value';
      input.dispatchEvent(new Event('input'));

      cancelButton.click();
      fixture.detectChanges();

      expect(component.item.title).toEqual('Sample to-do item.');
    });

  });

});
