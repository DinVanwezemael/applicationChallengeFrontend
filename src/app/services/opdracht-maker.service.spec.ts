import { TestBed } from '@angular/core/testing';

import { OpdrachtMakerService } from './opdracht-maker.service';

describe('OpdrachtMakerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OpdrachtMakerService = TestBed.get(OpdrachtMakerService);
    expect(service).toBeTruthy();
  });
});
