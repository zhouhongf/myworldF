import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysuserComponent } from './sysuser.component';

describe('SysuserComponent', () => {
  let component: SysuserComponent;
  let fixture: ComponentFixture<SysuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
