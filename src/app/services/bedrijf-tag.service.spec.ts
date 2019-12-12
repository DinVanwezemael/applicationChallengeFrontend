import { TestBed } from '@angular/core/testing';

import { BedrijfTagService } from './bedrijf-tag.service';

describe('BedrijfTagService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BedrijfTagService = TestBed.get(BedrijfTagService);
    expect(service).toBeTruthy();
  });
});
