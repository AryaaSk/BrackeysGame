import { TestBed } from '@angular/core/testing';

import { LevelGridsService } from './level-grids.service';

describe('LevelGridsService', () => {
  let service: LevelGridsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LevelGridsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
