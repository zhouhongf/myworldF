import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysadminFileComponent } from './sysadmin-file.component';

describe('SysadminFileComponent', () => {
  let component: SysadminFileComponent;
  let fixture: ComponentFixture<SysadminFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysadminFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysadminFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
