import { TestBed } from '@angular/core/testing';

import { BookborrowService } from './bookborrow.service';

describe('BookborrowService', () => {
  let service: BookborrowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookborrowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
