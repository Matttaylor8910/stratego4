import { TestBed } from '@angular/core/testing';

import { OutcomeService } from './outcome.service';

describe('OutcomeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OutcomeService = TestBed.get(OutcomeService);
    expect(service).toBeTruthy();
  });
});
