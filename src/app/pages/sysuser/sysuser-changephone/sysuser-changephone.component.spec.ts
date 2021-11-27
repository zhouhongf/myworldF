import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysuserChangephoneComponent } from './sysuser-changephone.component';

describe('SysuserChangephoneComponent', () => {
  let component: SysuserChangephoneComponent;
  let fixture: ComponentFixture<SysuserChangephoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysuserChangephoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysuserChangephoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
