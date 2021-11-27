import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomsheetAlertComponent } from './bottomsheet-alert.component';

describe('BottomsheetAlertComponent', () => {
  let component: BottomsheetAlertComponent;
  let fixture: ComponentFixture<BottomsheetAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottomsheetAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomsheetAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
