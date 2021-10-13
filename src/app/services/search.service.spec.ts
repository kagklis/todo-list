import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TodoItem } from '../model/todo-item';

import { SearchService } from './search.service';
import { TodoService } from './todo.service';

describe('SearchService', () => {
  let service: SearchService;
  let httpTestingController: HttpTestingController;

  const ITEMS: TodoItem[] = [
    { id: 1, title: "Walk the dog.", completed: true },
    { id: 2, title: "Go to the supermarket.", completed: false },
    { id: 3, title: "Do the dishes.", completed: true }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SearchService,
        TodoService
      ]
    });
    service = TestBed.inject(SearchService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with an empty search text', () => {
    service.searchText$.subscribe((searchText: string) => {
      expect(searchText).toEqual('');
    });
  });

  it('should clear search text', () => {
    service.reset();

    service.search('Something');

    service.searchText$.subscribe((searchText: string) => {
      expect(searchText).toEqual('Something');
    });
  });

  it('should set search text', () => {
    service.search('Something');

    service.reset();

    service.searchText$.subscribe((searchText: string) => {
      expect(searchText).toEqual('');
    });
  });

  it('should get 1 item as result on search', fakeAsync(() => {
    service.search(ITEMS[0].title);
    service.searchResults$.subscribe();
    tick(1000); // required to bypass debounceTime()
    const req = httpTestingController.expectOne(`api/todos?title=${ITEMS[0].title}`);

    req.flush([ITEMS[0]]);
    expect(req.request.method).toBe('GET');
    httpTestingController.verify();
  }));

  it('should get all items on reset', fakeAsync(() => {
    service.searchResults$.subscribe();
    tick(1000); // required to bypass debounceTime()
    const req = httpTestingController.expectOne('api/todos');

    req.flush(ITEMS);
    expect(req.request.method).toBe('GET');
    httpTestingController.verify();
  }));

});
