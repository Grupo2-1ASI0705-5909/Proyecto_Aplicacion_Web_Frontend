import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoCambioCrearComponent } from './tipo-cambio-crear.component';

describe('TipoCambioCrearComponent', () => {
  let component: TipoCambioCrearComponent;
  let fixture: ComponentFixture<TipoCambioCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoCambioCrearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoCambioCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
