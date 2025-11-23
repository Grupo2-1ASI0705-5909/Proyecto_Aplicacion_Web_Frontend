import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransaccionCrearComponent } from './transaccion-crear.component';

describe('TransaccionCrearComponent', () => {
  let component: TransaccionCrearComponent;
  let fixture: ComponentFixture<TransaccionCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransaccionCrearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransaccionCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
