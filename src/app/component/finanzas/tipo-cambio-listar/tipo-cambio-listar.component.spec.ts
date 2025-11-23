import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoCambioListarComponent } from './tipo-cambio-listar.component';

describe('TipoCambioListarComponent', () => {
  let component: TipoCambioListarComponent;
  let fixture: ComponentFixture<TipoCambioListarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoCambioListarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoCambioListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
