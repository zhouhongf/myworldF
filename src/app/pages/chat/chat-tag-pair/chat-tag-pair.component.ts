import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BaseService} from '../../../providers/base.service';
import {NavigationEnd, Router} from '@angular/router';
import {FriendInterface} from '../../../models/system-interface';
import {Friend} from '../../../models/system-data';
import {APIService} from '../../../providers/api.service';
import {ChatService} from '../../../providers/chat.service';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'app-chat-tag-pair',
    templateUrl: './chat-tag-pair.component.html',
    styleUrls: ['./chat-tag-pair.component.scss'],
})
export class ChatTagPairComponent implements OnInit, OnDestroy {
    addUrl = 'assets/images/ionic-add.svg';
    delUrl = 'assets/images/ionic-remove.svg';
    navigationSubscription;
    tagIdDetail: string;
    tagForm: FormGroup;
    hideBadge = true;

    showUntag = false;
    allUntagContacts = new Set();
    formatContacts = [];  // 按首字母顺序格式化后的数组
    formatLetters = new Set();
    letters = [];
    selectedItems = new Set();

    showContactDetail = false;
    currentFriend;

    constructor(
        private formBuilder: FormBuilder,
        private baseService: BaseService,
        private chatService: ChatService,
        private router: Router,
        private storage: Storage,
        private elementRef: ElementRef) {
    }

    ngOnInit() {
        this.createForm();
        this.navigationSubscription = this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                const fullUrl = event.url.split(';');
                if (fullUrl[0] === '/chat/tagPair') {
                    if (fullUrl[1]) {
                        const paramsOne = fullUrl[1].split('=');
                        this.tagIdDetail = decodeURIComponent(paramsOne[1]);
                        this.getFriendsInCurrentTag();
                    }
                    console.log('tagIdDetail是：', this.tagIdDetail);
                    this.makeAllUntagContacts();
                }
            }
        });
    }

    ngOnDestroy() {
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }

    goBack() {
        if (this.showUntag === true) {
            if (this.selectedItems.size > 0) {
                this.selectedItems.forEach(item => {
                    this.addPhoneContact(item);
                    while (this.allUntagContacts.has(item)) {
                        this.allUntagContacts.delete(item);
                    }
                });
            }
            this.showUntag = false;
        } else {
            return this.router.navigate(['/chat/home']);
        }
    }

    createForm() {
        this.tagForm = this.formBuilder.group({
            idDetail: '',
            name: ['', [Validators.required, Validators.pattern(APIService.nicknamePattern)]],
            phoneContacts: this.formBuilder.array([])
        });
    }

    get idDetail() {
        return this.tagForm.get('idDetail');
    }

    get name() {
        return this.tagForm.get('name');
    }

    get phoneContacts(): FormArray {
        return this.tagForm.get('phoneContacts') as FormArray;
    }

    setPhoneContacts(phoneContacts: FriendInterface[]) {
        const phoneContactFGs = phoneContacts.map(phoneContact => this.formBuilder.group(phoneContact));
        const phoneContactFormArray = this.formBuilder.array(phoneContactFGs);
        this.tagForm.setControl('phoneContacts', phoneContactFormArray);
    }

    addPhoneContact(phoneContact) {
        this.phoneContacts.push(this.formBuilder.group(phoneContact));
    }

    delPhoneContact(index, item) {
        console.log('准备执行delPhoneContact，删除：', index);
        this.phoneContacts.removeAt(index);
        this.allUntagContacts.add(item);
    }

    detailPhoneContact(item) {
        localStorage.setItem(APIService.SAVE_LOCAL.currentFriendTemp, JSON.stringify(item));
        this.currentFriend = item;
        this.showContactDetail = true;
    }


    showUntagFriends() {
        if (this.allUntagContacts.size > 0) {
            this.selectedItems = new Set<any>();
            this.makeFormatUntagContactsWithLetters(Array.from(this.allUntagContacts));
            this.showUntag = true;
            this.hideBadge = true;
        } else {
            return this.baseService.presentToast('没有未分配标签的伙伴了');
        }
    }


    getFriendsInCurrentTag() {
        this.idDetail.patchValue(this.tagIdDetail);
        if (this.tagIdDetail !== undefined && this.tagIdDetail !== 'NEW') {
            const data = JSON.parse(localStorage.getItem(APIService.SAVE_LOCAL.currentFriendsInTag));
            const tagName = data.name;
            if (tagName !== '未分类') {
                this.name.patchValue(data.name);
                this.setPhoneContacts(data.data);
            }
        }
    }

    makeAllUntagContacts() {
        this.storage.get(APIService.SAVE_STORAGE.allContacts).then(data => {
            if (data) {
                this.allUntagContacts = new Set<any>();
                for (const one of data.allContacts) {
                    const values = one.value;
                    for (const two of values) {
                        const friend: Friend = two;
                        if (friend.tag === '未分类') {
                            this.allUntagContacts.add(friend);
                        }
                    }
                }
                this.makeFormatUntagContactsWithLetters(Array.from(this.allUntagContacts));
            }
        });
    }

    makeFormatUntagContactsWithLetters(data) {
        this.formatContacts = [];
        this.formatLetters = new Set();
        const reg = /^[A-Za-z]+$/;
        for (const one of data) {
            const len = this.formatContacts.length;
            const obj: Friend = one;
            if (!reg.test(obj.pinyinName) || obj.displayName === '') {
                // 非正常名字，联系人中文名字转为拼音，不符合英文正则，或者中文名字为空的，放入Z栏下
                for (let j = 0; j < len; j++) {
                    if ((this.formatContacts[j] as any).key === '#') {
                        (this.formatContacts[j] as any).value.push(obj);
                        this.formatLetters.add('#');
                        break;
                    }
                }
            } else {
                const camelChar = obj.pinyinName.substring(0, 1);
                if (reg.test(camelChar)) {
                    // 首字母符合英文正则
                    let j = 0;
                    for (j; j < len; j++) {
                        if ((this.formatContacts[j] as any).key === camelChar) {
                            (this.formatContacts[j] as any).value.push(obj);  // 将对象obj放入对应的首字母栏下
                            break;
                        }
                    }
                    if (j === len) { // 处理最后一个obj
                        const arr = [];
                        arr.push(obj);
                        this.formatContacts[len] = {key: camelChar, value: arr};
                    }
                    this.formatLetters.add(camelChar);
                }
            }
        }
        this.letters = Array.from(this.formatLetters).sort();
        this.formatContacts = this.chatService.sortContacts(this.formatContacts);
    }

    scrollToTop(letter) {
        const el = this.elementRef.nativeElement.querySelector('ion-item-divider#' + letter);
        if (el) {
            setTimeout(() => {
                el.scrollIntoView(true);
            });
        }
    }

    selectThis(event) {
        const checked = event.checked;
        const item = event.source.value;
        if (checked === true) {
            this.selectedItems.add(item);
        } else if (checked === false) {
            this.selectedItems.delete(item);
        }
        console.log('当前添加伙伴有：', this.selectedItems);
    }



    saveTag() {
        if (this.phoneContacts.controls.length < 1) {
            return this.baseService.presentToast('请添加伙伴');
        }
        const phoneContactsList = [];
        this.phoneContacts.controls.forEach(item => {
            phoneContactsList.push(item.value.wid);
        });
        if (this.idDetail.value === undefined || this.idDetail.value === '') {
            this.idDetail.patchValue('NEW');
        }

        const params = {idDetail: this.idDetail.value, name: this.name.value};
        this.baseService.httpPost(APIService.CHAT.editContactTag, params, phoneContactsList, data => {
            if (data['code'] === 0) {
                return this.router.navigate(['/chat']);
            } else {
                return this.baseService.presentToast(data['msg']);
            }
        }, true);
    }

    delTag() {
        if (this.tagIdDetail !== undefined && this.tagIdDetail !== 'NEW') {
            this.baseService.httpDelete(APIService.CHAT.delContactTag, {idDetail: this.tagIdDetail}, data => {
                if (data['code'] === 0) {
                    return this.router.navigate(['/chat']);
                } else {
                    return this.baseService.presentToast(data['msg']);
                }
            }, true);
        }
    }

    goToMessageDetail() {
        this.router.navigate(['/chat/messagePair']).then(() => {
            this.showUntag = false;
            this.showContactDetail = false;
        });
    }
}
