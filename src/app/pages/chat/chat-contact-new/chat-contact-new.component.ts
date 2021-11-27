import { Component, OnInit } from '@angular/core';
import {APIService} from '../../../providers/api.service';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BaseService} from '../../../providers/base.service';
import {pinyin} from '../../../models/pingyin';
import {Friend} from '../../../models/system-data';
import {ChatService} from '../../../providers/chat.service';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'app-chat-contact-new',
    templateUrl: './chat-contact-new.component.html',
    styleUrls: ['./chat-contact-new.component.scss']
})
export class ChatContactNewComponent implements OnInit {
    formatContacts = [];  // 按首字母顺序格式化后的数组
    searchingItems = []; // 搜索显示的数组
    searchValue;

    isSearching = false;
    showConfirm = false;

    confirmForm: FormGroup;
    friendApplies;
    friendApplyContent: string;
    tagNameList = [];
    userWid: string;

    customAlertOptions: any = {
        header: '伙伴标签',
        translucent: true
    };

    constructor(
        private baseService: BaseService,
        private chatService: ChatService,
        private storage: Storage,
        private formBuilder: FormBuilder,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.userWid = this.baseService.getWidLocal();
        this.createForm();
        this.getTagNameList();
        this.getFriendApplies();
    }

    getTagNameList() {
        const dataList = localStorage.getItem(APIService.SAVE_LOCAL.contactTags);
        if (dataList) {
            const data = JSON.parse(dataList);
            for (const one of data) {
                this.tagNameList.push(one.name);
            }
        }
    }

    getFriendApplies() {
        this.storage.get(APIService.SAVE_STORAGE.friendApplies).then(data => {
            if (data) {
                this.friendApplies = data;
                this.makeSearchContacts(this.friendApplies);
            }
        });
    }

    makeSearchContacts(data) {
        this.formatContacts = [];
        for (const one of data) {
            let obj = {
                idDetail: '',
                role: '',
                applyTime: '',
                wid: '',
                avatar: '',
                displayName: '',
                phoneNumber: '',
                letterName: '',
                remarkName: '',
                applyContent: '',
                targetContent: ''
            };
            obj.idDetail = one.idDetail;
            if (this.userWid === one.targetWid) {
                // 我是被申请人，则显示发起者信息
                obj.role = 'TARGET';
                obj.applyTime = one.applyTime;
                obj.wid = one.userWid;
                obj.avatar = APIService.avatarPrefix + one.userWid;
                obj.displayName = one.userDisplayName;
                obj.phoneNumber = one.userPhoneNumber;
                obj.letterName = pinyin.getCamelChars(obj.displayName);
                obj.remarkName = one.remarkNameForUser;
                obj.applyContent = one.applyContent;
                obj.targetContent = one.targetContent;
            } else if (this.userWid === one.userWid) {
                // 我是申请人，则显示目标人信息
                obj.role = 'APPLIER';
                obj.applyTime = one.applyTime;
                obj.wid = one.targetWid;
                obj.avatar = APIService.avatarPrefix + one.targetWid;
                obj.displayName = one.targetDisplayName;
                obj.phoneNumber = one.targetPhoneNumber;
                obj.letterName = pinyin.getCamelChars(obj.displayName);
                obj.remarkName = one.remarkNameForTarget;
                obj.applyContent = one.applyContent;
                obj.targetContent = one.targetContent;
            }
            this.formatContacts.push(obj);
            obj = null;
        }
    }

    createForm() {
        this.confirmForm = this.formBuilder.group({
            idDetail: '',
            wid: '',
            remarkName: ['', [Validators.required, Validators.pattern(APIService.nicknamePattern)]],
            tagName: '',
            result: '',
            reject: ''
        });
    }

    get idDetail() {
        return this.confirmForm.get('idDetail');
    }

    get wid() {
        return this.confirmForm.get('wid');
    }

    get remarkName() {
        return this.confirmForm.get('remarkName');
    }

    get tagName() {
        return this.confirmForm.get('tagName');
    }

    get result() {
        return this.confirmForm.get('result');
    }

    get reject() {
        return this.confirmForm.get('reject');
    }

    getItems(ev: any) {
        this.isSearching = true;
        const val = ev.target.value;
        this.searchValue = val;
        this.searchingItems = this.formatContacts;
        if (val && val.trim() !== '') {
            const regZh = /^[\u4e00-\u9fa5]+$/;
            const regNums = /^[0-9]+$/;
            const regLetter = /^[A-Za-z]+$/;
            if (regZh.test(val)) {
                this.searchingItems = this.searchingItems.filter((item) => {
                    return (item.displayName.toLowerCase().indexOf(val.toLowerCase()) > -1);
                });
            } else if (regNums.test(val)) {
                this.searchingItems = this.searchingItems.filter((item) => {
                    return (item.phoneNumber.indexOf(val.toLowerCase()) > -1);
                });
            } else if (regLetter.test(val)) {
                this.searchingItems = this.searchingItems.filter((item) => {
                    return (item.letterName.toLowerCase().indexOf(val.toLowerCase()) > -1);
                });
            }
        } else {
            this.isSearching = false;
        }
    }

    onCancelSearch(event) {
        this.isSearching = false;
        this.searchingItems = [];
    }

    goToContactDetail(item) {
        const currentFriend = new Friend(item.wid, item.avatar, item.displayName);
        localStorage.setItem(APIService.SAVE_LOCAL.currentFriendTemp, JSON.stringify(currentFriend));

        this.router.navigate(['/chat/contactDetail', {
            isFriend: APIService.pending,
            backUrl: '/chat/contactNew'
        }]);
    }

    showContactConfirm(item) {
        this.showConfirm = true;
        this.idDetail.patchValue(item.idDetail);
        this.wid.patchValue(item.wid);
        this.remarkName.patchValue(item.displayName);
        this.friendApplyContent = item.applyContent;
    }

    confirmFriendApply() {
        if (this.tagName.value.trim() === '') {
            this.tagName.patchValue('未分类');
        }
        if (this.reject.value.trim() === '') {
            this.reject.patchValue('NONE');
        }
        const params = {wid: this.wid.value, remarkName: this.remarkName.value.trim(), tagName: this.tagName.value.trim(), result: this.result.value};
        this.baseService.httpPost(APIService.CHAT.confirmFriend, params, this.reject.value.trim(), data => {
           if (data['code'] === 0) {
               return this.router.navigate(['/chat']).then(() => {
                   this.removeFromDataList();
                   this.showConfirm = false;
               });
           } else {
               return this.baseService.presentToast(data['msg']);
           }
        });
    }

    removeFromDataList() {
        for (let i = 0; i < this.friendApplies.length; i++) {
            const value = this.friendApplies[i];
            if (this.idDetail.value === value.idDetail) {
                this.addToAllContacts(value);                   // 将验证通过的伙伴添加到通讯录中
                this.friendApplies.splice(i, 1);    // 将该已验证的伙伴从伙伴申请中去掉
            }
        }
        this.storage.set(APIService.SAVE_STORAGE.friendApplies, this.friendApplies);
    }

    addToAllContacts(friendApply) {
        const remarkName = this.tagName.value.trim();
        const pinyinName = pinyin.getFullChars(remarkName);
        const obj: Friend = new Friend(friendApply.userWid, friendApply.userAvatar, friendApply.userDisplayName, friendApply.userPhoneNumber, remarkName, pinyinName, this.tagName.value.trim());
        this.chatService.addToAllContacts(obj);
    }

}
