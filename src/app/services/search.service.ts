import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { TodoItem } from '../model/todo-item';
import { LoadingService } from './loading.service';
import { TodoService } from './todo.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchTextSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readonly searchText$: Observable<string> = this.searchTextSubject.asObservable();

  constructor(private loadingService: LoadingService,
    private todoService: TodoService) { }

  searchResults$: Observable<TodoItem[]> = this.searchText$.pipe(
    map((searchText: string) => searchText.trim()),
    debounceTime(750),
    distinctUntilChanged(),
    tap(() => this.loadingService.loading()),
    switchMap((searchText: string) => {
      return (searchText != '') ?
        this.todoService.getTodoItemsByTitle(searchText) :
        this.todoService.getTodoItems();
    })
  );

  search(searchText: string): void {
    this.searchTextSubject.next(searchText);
  }

  reset() {
    this.searchTextSubject.next('');
  }

}
