import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Micomponente } from './micomponente';

describe('Micomponente', () => {
  let component: Micomponente;
  let fixture: ComponentFixture<Micomponente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Micomponente],
    }).compileComponents();

    fixture = TestBed.createComponent(Micomponente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
