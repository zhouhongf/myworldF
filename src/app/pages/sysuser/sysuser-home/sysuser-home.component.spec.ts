import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysuserHomeComponent } from './sysuser-home.component';

describe('SysuserHomeComponent', () => {
  let component: SysuserHomeComponent;
  let fixture: ComponentFixture<SysuserHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysuserHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysuserHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
