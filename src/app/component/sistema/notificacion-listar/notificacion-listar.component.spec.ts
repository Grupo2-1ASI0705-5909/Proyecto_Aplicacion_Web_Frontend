import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionListarComponent } from './notificacion-listar.component';

describe('NotificacionListarComponent', () => {
  let component: NotificacionListarComponent;
  let fixture: ComponentFixture<NotificacionListarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacionListarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificacionListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
