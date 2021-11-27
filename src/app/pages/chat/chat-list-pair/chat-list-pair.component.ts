import { Component, OnInit } from '@angular/core';
import {Friend} from '../../../models/system-data';
import {Router} from '@angular/router';
import {APIService} from '../../../providers/api.service';

@Component({
  selector: 'app-chat-list-pair',
  templateUrl: './chat-list-pair.component.html',
  styleUrls: ['./chat-list-pair.component.scss'],
})
export class ChatListPairComponent implements OnInit {

  friends: Array<Friend>;
  tagName: string;

  constructor(private router: Router) {
  }

  ngOnInit() {
    const data = JSON.parse(localStorage.getItem(APIService.SAVE_LOCAL.currentFriendsInTag));
    this.tagName = data.name;
    this.friends = data.data;
  }

  goToMessageDetail(item) {
    const currentFriend = new Friend(item.wid, item.avatar, item.nickname, item.phoneNumber, item.displayName, item.pinyinName, item.tag);
    localStorage.setItem(APIService.SAVE_LOCAL.currentFriendTemp, JSON.stringify(currentFriend));
    return this.router.navigate(['/chat/messagePair']);
  }

}
