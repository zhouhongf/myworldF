import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CityLinksComponent } from './city-links.component';

describe('CityLinksComponent', () => {
  let component: CityLinksComponent;
  let fixture: ComponentFixture<CityLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CityLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
