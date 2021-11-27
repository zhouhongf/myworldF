import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WealthHomeComponent } from './wealth-home.component';

describe('WealthHomeComponent', () => {
  let component: WealthHomeComponent;
  let fixture: ComponentFixture<WealthHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WealthHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WealthHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
