import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatContactNewComponent } from './chat-contact-new.component';

describe('ChatContactNewComponent', () => {
  let component: ChatContactNewComponent;
  let fixture: ComponentFixture<ChatContactNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatContactNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatContactNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
