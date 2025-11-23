import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransaccionListarComponent } from './transaccion-listar.component';

describe('TransaccionListarComponent', () => {
  let component: TransaccionListarComponent;
  let fixture: ComponentFixture<TransaccionListarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransaccionListarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransaccionListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
