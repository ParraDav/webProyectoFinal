import { TestBed } from '@angular/core/testing';

import { proyectoFinalService } from './proyectoFinal-service';

describe('proyectoFinalService', () => {
  let service: proyectoFinalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(proyectoFinalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
