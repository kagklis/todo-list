import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;
  let httpTestingController: HttpTestingController;

  const TEST_ITEM = { id: 3, title: 'Write some code.', completed: false };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TodoService
      ]
    });
    service = TestBed.inject(TodoService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get todo items by title using the correct URL', () => {
    service.getTodoItemsByTitle(TEST_ITEM.title).subscribe();

    const req = httpTestingController.expectOne(`api/todos?title=${TEST_ITEM.title}`);

    req.flush([{ ...TEST_ITEM }]);
    expect(req.request.method).toBe('GET');
    httpTestingController.verify();
  });

  it('should post with the correct URL', () => {
    service.createTodoItem(TEST_ITEM).subscribe();

    const req = httpTestingController.expectOne('api/todos');

    req.flush({ ...TEST_ITEM });
    expect(req.request.method).toBe('POST');
    httpTestingController.verify();
  });

  it('should delete with the correct URL', () => {
    service.deleteTodoItem(TEST_ITEM.id).subscribe();

    const req = httpTestingController.expectOne(`api/todos/${TEST_ITEM.id}`);

    req.flush({});
    expect(req.request.method).toBe('DELETE');
    httpTestingController.verify();
  });

});
