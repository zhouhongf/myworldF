import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CdkVirtualScrollViewportComponent } from './cdk-virtual-scroll-viewport.component';

describe('CdkVirtualScrollViewportComponent', () => {
  let component: CdkVirtualScrollViewportComponent;
  let fixture: ComponentFixture<CdkVirtualScrollViewportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CdkVirtualScrollViewportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CdkVirtualScrollViewportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
