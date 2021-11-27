import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysuserResetpasswordComponent } from './sysuser-resetpassword.component';

describe('SysuserResetpasswordComponent', () => {
  let component: SysuserResetpasswordComponent;
  let fixture: ComponentFixture<SysuserResetpasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysuserResetpasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysuserResetpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
