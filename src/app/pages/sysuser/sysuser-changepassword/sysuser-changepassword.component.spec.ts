import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysuserChangepasswordComponent } from './sysuser-changepassword.component';

describe('SysuserChangepasswordComponent', () => {
  let component: SysuserChangepasswordComponent;
  let fixture: ComponentFixture<SysuserChangepasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysuserChangepasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysuserChangepasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
