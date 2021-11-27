import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysadminHomeComponent } from './sysadmin-home.component';

describe('SysadminHomeComponent', () => {
  let component: SysadminHomeComponent;
  let fixture: ComponentFixture<SysadminHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysadminHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysadminHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
