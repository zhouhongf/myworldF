import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatContactDetailComponent } from './chat-contact-detail.component';

describe('ChatContactDetailComponent', () => {
  let component: ChatContactDetailComponent;
  let fixture: ComponentFixture<ChatContactDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatContactDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatContactDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
