import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyquillComponent } from './myquill.component';

describe('MyquillComponent', () => {
  let component: MyquillComponent;
  let fixture: ComponentFixture<MyquillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyquillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyquillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
