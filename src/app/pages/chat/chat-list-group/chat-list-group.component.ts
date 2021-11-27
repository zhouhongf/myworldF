import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {APIService} from '../../../providers/api.service';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'app-chat-list-group',
    templateUrl: './chat-list-group.component.html',
    styleUrls: ['./chat-list-group.component.scss'],
})
export class ChatListGroupComponent implements OnInit {
    groupAvatarPrefix = APIService.avatarPrefixGroup;
    chatGroups: Array<any>;
    isEdit = false;

    constructor(private storage: Storage, private router: Router) {
    }

    ngOnInit() {
        this.storage.get(APIService.SAVE_STORAGE.currentGroupLists).then(data => {
            this.chatGroups = data;
        });
    }

    goToMessageDetail(item) {
        localStorage.setItem(APIService.SAVE_LOCAL.currentFriendsInGroup, JSON.stringify(item));
        if (this.isEdit) {
            return this.router.navigate(['/chat/tagGroup', {groupId: item.id}]).then(() => { this.isEdit = false; });
        }
        return this.router.navigate(['/chat/messageGroup']).then(() => { this.isEdit = false; });
    }

    goToTagGroup() {
        localStorage.removeItem(APIService.SAVE_LOCAL.currentFriendsInGroup);
        return this.router.navigate(['/chat/tagGroup']).then(() => { this.isEdit = false; });
    }

}
