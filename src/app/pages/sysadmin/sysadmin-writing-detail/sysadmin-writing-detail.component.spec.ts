import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysadminWritingDetailComponent } from './sysadmin-writing-detail.component';

describe('SysadminWritingDetailComponent', () => {
  let component: SysadminWritingDetailComponent;
  let fixture: ComponentFixture<SysadminWritingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysadminWritingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysadminWritingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
