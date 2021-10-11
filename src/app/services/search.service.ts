import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { TodoItem } from '../model/todo-item';
import { SpinnerService } from './spinner.service';
import { TodoService } from './todo.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchTextSubject: Subject<string> = new Subject<string>();
  searchText$: Observable<string> = this.searchTextSubject.asObservable();

  constructor(private spinnerService: SpinnerService,
    private todoService: TodoService) { }

  search(searchText: string): void {
    this.searchTextSubject.next(searchText);
  }

  getSearchResults(): Observable<TodoItem[]> {
    return this.searchText$.pipe(
      debounceTime(750),
      distinctUntilChanged(),
      tap(() => this.spinnerService.loading()),
      switchMap((searchText: string) =>
        (searchText != '') ?
          this.todoService.getTodoItemsByTitle(searchText) :
          this.todoService.getTodoItems()
      )
    );
  }

  reset() {
    this.searchTextSubject.next('');
  }

}
