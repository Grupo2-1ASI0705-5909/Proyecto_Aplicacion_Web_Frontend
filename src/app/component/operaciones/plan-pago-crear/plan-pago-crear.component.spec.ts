import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanPagoCrearComponent } from './plan-pago-crear.component';

describe('PlanPagoCrearComponent', () => {
  let component: PlanPagoCrearComponent;
  let fixture: ComponentFixture<PlanPagoCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanPagoCrearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanPagoCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
