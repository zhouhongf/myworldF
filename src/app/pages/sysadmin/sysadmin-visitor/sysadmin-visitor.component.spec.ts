import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysadminVisitorComponent } from './sysadmin-visitor.component';

describe('SysadminVisitorComponent', () => {
  let component: SysadminVisitorComponent;
  let fixture: ComponentFixture<SysadminVisitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysadminVisitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysadminVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
