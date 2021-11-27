import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MytinymceComponent } from './mytinymce.component';

describe('MytinymceComponent', () => {
  let component: MytinymceComponent;
  let fixture: ComponentFixture<MytinymceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MytinymceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MytinymceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
