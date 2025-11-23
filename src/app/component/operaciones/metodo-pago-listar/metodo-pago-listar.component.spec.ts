import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetodoPagoListarComponent } from './metodo-pago-listar.component';

describe('MetodoPagoListarComponent', () => {
  let component: MetodoPagoListarComponent;
  let fixture: ComponentFixture<MetodoPagoListarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetodoPagoListarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetodoPagoListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
