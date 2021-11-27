import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedHomeComponent } from './shared-home.component';

describe('SharedHomeComponent', () => {
  let component: SharedHomeComponent;
  let fixture: ComponentFixture<SharedHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
