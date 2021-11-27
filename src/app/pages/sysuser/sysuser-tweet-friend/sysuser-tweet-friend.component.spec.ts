import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SysuserTweetFriendComponent } from './sysuser-tweet-friend.component';

describe('SysuserTweetFriendComponent', () => {
  let component: SysuserTweetFriendComponent;
  let fixture: ComponentFixture<SysuserTweetFriendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysuserTweetFriendComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SysuserTweetFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
