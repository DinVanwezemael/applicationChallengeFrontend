import { TestBed } from '@angular/core/testing';

import { MakerTagService } from './maker-tag.service';

describe('MakerTagService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MakerTagService = TestBed.get(MakerTagService);
    expect(service).toBeTruthy();
  });
});
