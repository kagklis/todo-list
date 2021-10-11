import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TodoItem } from '../model/todo-item';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private readonly TODO_ITEMS_URL: string = 'https://instinctive-fork-snarl.glitch.me/todos';

  constructor(private http: HttpClient) { }

  getTodoItems(): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(this.TODO_ITEMS_URL).pipe(
      map(items => items.map(item => ({ ...item, editing: false })))
    );
  }

  createTodoItem(item: TodoItem): Observable<TodoItem> {
    return this.http.post<TodoItem>(this.TODO_ITEMS_URL, item);
  }

  updateTodoItem(item: TodoItem): Observable<TodoItem> {
    return this.http.put<TodoItem>(`${this.TODO_ITEMS_URL}/${item.id}`, item);
  }

  patchTodoItem(item: Partial<TodoItem>): Observable<TodoItem> {
    return this.http.patch<TodoItem>(`${this.TODO_ITEMS_URL}/${item.id}`, item);
  }

  deleteTodoItem(id: number): Observable<any> {
    return this.http.delete(`${this.TODO_ITEMS_URL}/${id}`);
  }

  getTodoItemsByTitle(searchText: string): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(`${this.TODO_ITEMS_URL}?title=${searchText}`).pipe(
      map(items => items.map(item => ({ ...item, editing: false })))
    );
  }

}
