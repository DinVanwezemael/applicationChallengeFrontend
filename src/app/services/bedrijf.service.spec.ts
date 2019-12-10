import { TestBed } from '@angular/core/testing';

import { BedrijfService } from './bedrijf.service';

describe('BedrijfService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BedrijfService = TestBed.get(BedrijfService);
    expect(service).toBeTruthy();
  });
});
