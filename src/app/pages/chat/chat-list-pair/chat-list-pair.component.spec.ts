import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChatListPairComponent } from './chat-list-pair.component';

describe('ChatListPairComponent', () => {
  let component: ChatListPairComponent;
  let fixture: ComponentFixture<ChatListPairComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatListPairComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatListPairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
