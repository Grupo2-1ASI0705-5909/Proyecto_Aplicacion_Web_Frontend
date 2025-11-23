import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanPagoListarComponent } from './plan-pago-listar.component';

describe('PlanPagoListarComponent', () => {
  let component: PlanPagoListarComponent;
  let fixture: ComponentFixture<PlanPagoListarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanPagoListarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanPagoListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
