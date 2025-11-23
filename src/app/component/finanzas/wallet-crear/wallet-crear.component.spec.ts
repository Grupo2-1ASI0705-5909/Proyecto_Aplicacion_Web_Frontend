import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCrearComponent } from './wallet-crear.component';

describe('WalletCrearComponent', () => {
  let component: WalletCrearComponent;
  let fixture: ComponentFixture<WalletCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletCrearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
