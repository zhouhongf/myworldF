import { Component, OnInit } from '@angular/core';
import {BaseService} from '../../../providers/base.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {APIService} from '../../../providers/api.service';
import {ChatService} from '../../../providers/chat.service';

@Component({
    selector: 'app-chat-contact-detail',
    templateUrl: './chat-contact-detail.component.html',
    styleUrls: ['./chat-contact-detail.component.scss']
})
export class ChatContactDetailComponent implements OnInit {
    backUrl: string;
    isFriend: string;
    currentFriend;

    showApplying = false;

    applyContent = new FormControl('', Validators.required);
    remarkName = new FormControl('', [Validators.required, Validators.pattern(APIService.nicknamePattern)]);
    tagName = new FormControl('');
    tagNameList = [];
    customAlertOptions: any = {
        header: '伙伴标签',
        translucent: true
    };

    constructor(
        private formBuilder: FormBuilder,
        private baseService: BaseService,
        private chatService: ChatService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.onInitial();
        this.getTagNameList();
    }

    onInitial() {
        this.route.paramMap.subscribe(data => {
            this.backUrl = data.get('backUrl');
            this.isFriend = data.get('isFriend');
            this.currentFriend = JSON.parse(localStorage.getItem(APIService.SAVE_LOCAL.currentFriendTemp));
            console.log('currentFriend是：', this.currentFriend);
            if (this.isFriend === APIService.yes) {
                this.remarkName.patchValue(this.currentFriend.displayName);
                this.tagName.patchValue(this.currentFriend.tag);
            }
        });
    }

    getTagNameList() {
        const theList = this.chatService.getTagNameList();
        if (theList) {
            this.tagNameList = theList;
        }
    }

    setBack() {
        this.showApplying = false;
        this.remarkName.reset();
        this.tagName.reset();
        this.applyContent.reset();
    }

    sendApply() {
        if (this.remarkName.value.trim() === '') {
            this.remarkName.patchValue(this.currentFriend.nickname);
        }
        if (this.tagName.value.trim() === '') {
            this.tagName.patchValue('未分类');
        }
        const params = {wid: this.currentFriend.wid, remarkName: this.remarkName.value.trim(), tagName: this.tagName.value};
        this.baseService.httpPost(APIService.CHAT.applyFriend, params, this.applyContent.value.trim(), data => {
            if (data['code'] === 0) {
                return this.router.navigate(['/chat']).then(() => {
                    this.setBack();
                });
            } else {
                return this.baseService.presentToast(data['msg']);
            }
        });
    }

    updateFriendInfo() {
        if (this.remarkName.value.trim() === '') {
            this.baseService.presentToast('备注名不能为空');
        }
        const params = {wid: this.currentFriend.wid, remarkName: this.remarkName.value.trim(), tagName: this.tagName.value};
        this.baseService.httpGet(APIService.CHAT.updateFriendInfo, params, data => {
            if (data['code'] === 0) {
                return this.router.navigate(['/chat']).then(() => {
                    this.setBack();
                });
            } else {
                return this.baseService.presentToast(data['msg']);
            }
        });
    }

    goToMessageDetail() {
        return this.router.navigate(['/chat/messagePair']);
    }
}
