import { Component, OnDestroy, OnInit } from '@angular/core';
import { iif, Observable, Subscription } from 'rxjs';
import { TodoList } from '../model/todo-list';
import { TodoItem } from '../model/todo-item';
import { SearchService } from '../services/search.service';
import { LoadingService } from '../services/loading.service';
import { TodoService } from '../services/todo.service';
import { map } from 'rxjs/operators';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit, OnDestroy {

  todoList: TodoList = new TodoList();
  searchText$: Observable<string>;
  isLoading$: Observable<boolean>;
  isItemLoading$: Observable<number>;
  sub!: Subscription;

  constructor(private loadingService: LoadingService,
    private searchService: SearchService,
    private todoService: TodoService) {
    this.searchText$ = this.searchService.searchText$;
    this.isLoading$ = this.loadingService.isLoading$;
    this.isItemLoading$ = this.loadingService.itemIsLoading$;
  }

  ngOnInit(): void {
    this.loadingService.loading();
    this.sub = this.searchService.searchResults$.subscribe((items: TodoItem[]) => {
      this.todoList = new TodoList(items);
      this.loadingService.complete();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  addTodoItem(): void {
    this.todoList.addEmptyItem();
  }

  completeEdit(item: TodoItem) {
    this.loadingService.itemLoading(item.id);
    iif(() => item.id === 0,
      this.todoService.createTodoItem(item),
      this.todoService.updateTodoItem(item)
    ).subscribe((savedItem: TodoItem) => {
      this.todoList.replaceItem(item, savedItem);
      this.loadingService.itemComplete();
    });
  }

  cancelEdit(item: TodoItem) {
    if (item.id === 0) {
      this.todoList.removeItemById(item.id);
    }
  }

  delete(item: TodoItem) {
    if (item.id === 0) {
      this.todoList.removeItemById(item.id);
      return;
    }
    this.loadingService.itemLoading(item.id);
    this.todoService.deleteTodoItem(item.id).subscribe(() => {
      this.todoList.removeItemById(item.id);
      this.loadingService.itemComplete();
    });
  }

  searchTextChanged(searchText: string) {
    this.searchService.search(searchText);
  }

  resetSearch() {
    this.searchService.reset();
  }

  trackByItems(_index: number, item: TodoItem): number { return item.id; }

  generateSkeletonItems(count: number) {
    return [...Array(count).keys()];
  }

  isItemLoading(item: TodoItem): Observable<boolean> {
    return this.isItemLoading$.pipe(
      map(id => (id < 0) || (id != item.id))
    );
  }

  drop(event: CdkDragDrop<TodoItem[]>) {
    this.todoList.rearrangeAfterDragAndDrop(event);
  }

}
