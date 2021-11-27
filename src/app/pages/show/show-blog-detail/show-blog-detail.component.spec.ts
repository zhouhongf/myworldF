import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowBlogDetailComponent } from './show-blog-detail.component';

describe('ShowBlogDetailComponent', () => {
  let component: ShowBlogDetailComponent;
  let fixture: ComponentFixture<ShowBlogDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowBlogDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowBlogDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
