import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysadminWritingComponent } from './sysadmin-writing.component';

describe('SysadminWritingComponent', () => {
  let component: SysadminWritingComponent;
  let fixture: ComponentFixture<SysadminWritingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysadminWritingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysadminWritingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
