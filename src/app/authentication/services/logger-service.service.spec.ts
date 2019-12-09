import { TestBed } from '@angular/core/testing';

import { LoggerService } from './logger-service.service';

describe('LoggerServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoggerService = TestBed.get(LoggerService);
    expect(service).toBeTruthy();
  });
});
