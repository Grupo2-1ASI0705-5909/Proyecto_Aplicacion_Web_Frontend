import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetodoPagoCrearComponent } from './metodo-pago-crear.component';

describe('MetodoPagoCrearComponent', () => {
  let component: MetodoPagoCrearComponent;
  let fixture: ComponentFixture<MetodoPagoCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetodoPagoCrearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetodoPagoCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
