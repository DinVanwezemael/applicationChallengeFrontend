import { TestBed } from '@angular/core/testing';

import { OpdrachtTagService } from './opdracht-tag.service';

describe('OpdrachtTagService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OpdrachtTagService = TestBed.get(OpdrachtTagService);
    expect(service).toBeTruthy();
  });
});
