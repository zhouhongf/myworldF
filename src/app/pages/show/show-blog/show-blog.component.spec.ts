import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowBlogComponent } from './show-blog.component';

describe('ShowBlogComponent', () => {
  let component: ShowBlogComponent;
  let fixture: ComponentFixture<ShowBlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowBlogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
