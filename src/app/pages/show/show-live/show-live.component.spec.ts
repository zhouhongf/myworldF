import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowLiveComponent } from './show-live.component';

describe('ShowLiveComponent', () => {
  let component: ShowLiveComponent;
  let fixture: ComponentFixture<ShowLiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowLiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
