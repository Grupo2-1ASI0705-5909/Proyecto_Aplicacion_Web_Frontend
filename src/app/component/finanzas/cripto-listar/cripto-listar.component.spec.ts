import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriptoListarComponent } from './cripto-listar.component';

describe('CriptoListarComponent', () => {
  let component: CriptoListarComponent;
  let fixture: ComponentFixture<CriptoListarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriptoListarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriptoListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
