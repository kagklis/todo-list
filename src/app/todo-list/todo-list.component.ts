import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { iif, Observable, Subscription } from 'rxjs';
import { TodoItem } from '../model/todo-item';
import { SearchService } from '../services/search.service';
import { SpinnerService } from '../services/spinner.service';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit, OnDestroy {

  data: TodoItem[] = [];
  items: TodoItem[] = [];
  searchText$: Observable<string>;
  isLoading$: Observable<boolean>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageEvent!: PageEvent;

  todoListLength: number = 0;
  pageSize: number = 6;
  currentPage: number = 0;
  start: number = 0;
  end: number = this.pageSize;
  sub!: Subscription;

  constructor(private spinnerService: SpinnerService,
    private searchService: SearchService,
    private todoService: TodoService) {
    this.searchText$ = this.searchService.searchText$;
    this.isLoading$ = this.spinnerService.isLoading$;
  }

  ngOnInit(): void {
    this.spinnerService.loading();
    this.todoService.getTodoItems().subscribe((items: TodoItem[]) => {
      this.updateDataAndStopSpinner(items);
    });

    this.sub = this.searchService.getSearchResults().subscribe((items: TodoItem[]) => {
      this.updateDataAndStopSpinner(items);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private updateDataAndStopSpinner(items: TodoItem[]) {
    this.items = items;
    this.todoListLength = items.length;
    this.data = items.slice(this.start, this.end);
    this.spinnerService.complete();
  }

  addTodoItem(): void {
    const emptyTodoExists = this.items?.some(item => item.id === 0);
    if (emptyTodoExists) {
      this.goToLastPage();
      return;
    }

    this.items?.push({
      id: 0,
      title: '',
      completed: false,
      editing: true
    });
    this.todoListLength = this.items.length;
    this.goToLastPage();
  }

  completeEdit(item: TodoItem) {
    this.spinnerService.loading();
    const itemId = item.id;
    iif(() => itemId === 0,
      this.todoService.createTodoItem(item),
      this.todoService.updateTodoItem(item)
    ).subscribe((savedItem: TodoItem) => {
      this.replaceTodoItem(itemId, { ...savedItem, editing: false });
      this.spinnerService.complete();
    });
  }

  cancelEdit(id: number) {
    if (id === 0) {
      this.removeTodoItem(id);
    }
  }

  deleteItem(id: number) {
    if (id === 0) {
      this.removeTodoItem(id);
      return;
    }
    this.spinnerService.loading();
    this.todoService.deleteTodoItem(id).subscribe(() => {
      this.removeTodoItem(id);
      this.spinnerService.complete();
    });
  }

  private removeTodoItem(id: number) {
    this.replaceTodoItem(id, null);
    this.fallbackToPreviousPage();
  }

  private replaceTodoItem(id: number, newItem: TodoItem | null) {
    const index = this.items.findIndex(item => item.id == id);
    if (index > -1) {
      !!newItem ?
        this.items.splice(index, 1, newItem) :
        this.items.splice(index, 1);
      this.todoListLength = this.items.length;
    }
    this.updateDataSlice();
  }

  searchTextChanged(searchText: string) {
    this.searchService.search(searchText);
  }

  resetSearch() {
    this.searchService.reset();
  }

  trackByItems(_index: number, item: TodoItem): number { return item.id; }

  pageChanged(event: PageEvent) {
    this.pageEvent = event;
    this.currentPage = this.pageEvent.pageIndex;
    this.updateDataSlice();
  }

  private updateDataSlice() {
    this.start = this.currentPage * this.pageSize;
    this.end = (this.currentPage + 1) * this.pageSize;
    this.data = this.items.slice(this.start, this.end);
  }

  private goToLastPage() {
    this.paginator.lastPage();
    this.currentPage = Math.ceil(this.todoListLength / this.pageSize) - 1;
    this.updateDataSlice();
  }

  private fallbackToPreviousPage() {
    if (this.todoListLength % this.pageSize === 0 &&
      this.currentPage === (this.paginator.getNumberOfPages() - 1)) {
      this.paginator.previousPage();
    }
  }

}
