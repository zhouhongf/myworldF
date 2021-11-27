import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthLoginSmsComponent } from './auth-login-sms.component';

describe('AuthLoginSmsComponent', () => {
  let component: AuthLoginSmsComponent;
  let fixture: ComponentFixture<AuthLoginSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthLoginSmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthLoginSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
