import { TestBed } from '@angular/core/testing';

import { PlacementService } from './placement.service';

describe('PlacementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlacementService = TestBed.get(PlacementService);
    expect(service).toBeTruthy();
  });
});
