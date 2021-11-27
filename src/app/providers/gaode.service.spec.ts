import { TestBed } from '@angular/core/testing';

import { GaodeService } from './gaode.service';

describe('GaodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GaodeService = TestBed.get(GaodeService);
    expect(service).toBeTruthy();
  });
});
