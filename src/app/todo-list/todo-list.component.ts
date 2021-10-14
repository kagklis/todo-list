import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { iif, Observable, Subscription } from 'rxjs';
import { PagedTodoList } from '../model/paged-todo-list';
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

  pagedTodoList: PagedTodoList = new PagedTodoList();
  searchText$: Observable<string>;
  isLoading$: Observable<boolean>;
  sub!: Subscription;

  constructor(private spinnerService: SpinnerService,
    private searchService: SearchService,
    private todoService: TodoService) {
    this.searchText$ = this.searchService.searchText$;
    this.isLoading$ = this.spinnerService.isLoading$;
  }

  ngOnInit(): void {
    this.spinnerService.loading();
    this.sub = this.searchService.searchResults$.subscribe((items: TodoItem[]) => {
      this.pagedTodoList = new PagedTodoList(items);
      this.spinnerService.complete();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  addTodoItem(): void {
    this.pagedTodoList.addEmptyItem();
  }

  completeEdit(item: TodoItem) {
    this.spinnerService.loading();
    iif(() => item.id === 0,
      this.todoService.createTodoItem(item),
      this.todoService.updateTodoItem(item)
    ).subscribe((savedItem: TodoItem) => {
      this.pagedTodoList.replaceItem(item, savedItem);
      this.spinnerService.complete();
    });
  }

  cancelEdit(item: TodoItem) {
    if (item.id === 0) {
      this.pagedTodoList.removeItemById(item.id);
    }
  }

  delete(item: TodoItem) {
    if (item.id === 0) {
      this.pagedTodoList.removeItemById(item.id);
      return;
    }
    this.spinnerService.loading();
    this.todoService.deleteTodoItem(item.id).subscribe(() => {
      this.pagedTodoList.removeItemById(item.id);
      this.spinnerService.complete();
    });
  }

  searchTextChanged(searchText: string) {
    this.searchService.search(searchText);
  }

  resetSearch() {
    this.searchService.reset();
  }

  trackByItems(_index: number, item: TodoItem): number { return item.id; }

  pageChanged(event: PageEvent) {
    this.pagedTodoList.goToPage(event.pageIndex);
  }

}
