import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowBlogMakeComponent } from './show-blog-make.component';

describe('ShowBlogMakeComponent', () => {
  let component: ShowBlogMakeComponent;
  let fixture: ComponentFixture<ShowBlogMakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowBlogMakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowBlogMakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
