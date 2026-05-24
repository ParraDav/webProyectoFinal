import { ComponentFixture, TestBed } from '@angular/core/testing';

import { proyectoFinalComponent } from './proyectoFinal-component';

describe('proyectoFinalComponent', () => {
  let component: proyectoFinalComponent;
  let fixture: ComponentFixture<proyectoFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [proyectoFinalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(proyectoFinalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
