import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuotaDialogComponent } from './cuota-dialog.component';

describe('CuotaDialogComponent', () => {
  let component: CuotaDialogComponent;
  let fixture: ComponentFixture<CuotaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuotaDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuotaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
