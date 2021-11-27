import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WealthRankComponent } from './wealth-rank.component';

describe('WealthRankComponent', () => {
  let component: WealthRankComponent;
  let fixture: ComponentFixture<WealthRankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WealthRankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WealthRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
