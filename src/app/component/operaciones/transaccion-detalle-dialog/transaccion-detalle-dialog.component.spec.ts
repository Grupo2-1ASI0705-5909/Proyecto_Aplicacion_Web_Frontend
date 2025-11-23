import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransaccionDetalleDialogComponent } from './transaccion-detalle-dialog.component';

describe('TransaccionDetalleDialogComponent', () => {
  let component: TransaccionDetalleDialogComponent;
  let fixture: ComponentFixture<TransaccionDetalleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransaccionDetalleDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransaccionDetalleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
