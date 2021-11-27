import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatContactAddComponent } from './chat-contact-add.component';

describe('ChatContactAddComponent', () => {
  let component: ChatContactAddComponent;
  let fixture: ComponentFixture<ChatContactAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatContactAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatContactAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
