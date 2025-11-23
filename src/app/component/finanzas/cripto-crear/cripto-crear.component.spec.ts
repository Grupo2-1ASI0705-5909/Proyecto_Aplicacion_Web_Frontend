import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriptoCrearComponent } from './cripto-crear.component';

describe('CriptoCrearComponent', () => {
  let component: CriptoCrearComponent;
  let fixture: ComponentFixture<CriptoCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriptoCrearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriptoCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
