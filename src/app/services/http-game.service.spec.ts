import { TestBed } from '@angular/core/testing';

import { HttpGameService } from './http-game.service';

describe('HttpGameService', () => {
  let service: HttpGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
