import { TestBed } from '@angular/core/testing';

import { SearchService } from './search.service';
import { SpinnerService } from './spinner.service';
import { TodoService } from './todo.service';

describe('SearchService', () => {
  let service: SearchService;
  let mockTodoService;
  let mockSpinnerService;

  beforeEach(() => {
    mockTodoService = jasmine.createSpyObj(['getTodoItems', 'getTodoItemsByTitle']);
    mockSpinnerService = jasmine.createSpyObj(['loading']);
    TestBed.configureTestingModule({
      providers: [
        { provide: TodoService, useValue: mockTodoService },
        { provide: SpinnerService, useValue: mockSpinnerService }
      ]
    });
    service = TestBed.inject(SearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
