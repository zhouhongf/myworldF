import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WealthCustomComponent } from './wealth-custom.component';

describe('WealthCustomComponent', () => {
  let component: WealthCustomComponent;
  let fixture: ComponentFixture<WealthCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WealthCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WealthCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
