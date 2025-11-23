import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletListarComponent } from './wallet-listar.component';

describe('WalletListarComponent', () => {
  let component: WalletListarComponent;
  let fixture: ComponentFixture<WalletListarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletListarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
