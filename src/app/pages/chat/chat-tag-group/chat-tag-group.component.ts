import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BaseService} from '../../../providers/base.service';
import {NavigationEnd, Router} from '@angular/router';
import {FriendInterface} from '../../../models/system-interface';
import {Friend} from '../../../models/system-data';
import {APIService} from '../../../providers/api.service';
import {ChatService} from '../../../providers/chat.service';
import {Storage} from '@ionic/storage';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {ActionSheetController} from '@ionic/angular';
import {NativeService} from '../../../providers/native.service';
import {PreviewimgService} from '../../../providers/previewimg.service';
import {pinyin} from '../../../models/pingyin';

@Component({
    selector: 'app-chat-tag-group',
    templateUrl: './chat-tag-group.component.html',
    styleUrls: ['./chat-tag-group.component.scss'],
})
export class ChatTagGroupComponent implements OnInit, OnDestroy {
    isMobile;
    navigationSubscription;
    addUrl = 'assets/images/ionic-add.svg';
    delUrl = 'assets/images/ionic-remove.svg';
    groupAvatar = 'assets/images/ionic-people.svg';
    groupId: string;
    groupData;

    avatarPrefix = APIService.avatarPrefix;

    isGroupCreator = false;
    userWid: string;
    groupForm: FormGroup;
    hideBadge = true;

    showUnGrouped = false;

    allSearchContacts = new Set();
    formatContacts = [];                // 按首字母顺序格式化后的数组
    formatLetters = new Set();
    letters = [];
    selectedItems = new Set();

    showContactDetail = false;
    currentFriend;

    constructor(
        private formBuilder: FormBuilder,
        private baseService: BaseService,
        private chatService: ChatService,
        private nativeService: NativeService,
        private router: Router,
        private storage: Storage,
        private elementRef: ElementRef,
        private camera: Camera,
        private actionSheetCtrl: ActionSheetController,
        private previewimgService: PreviewimgService) {
    }

    ngOnInit() {
        this.isMobile = this.baseService.isMobile();
        this.userWid = this.baseService.getWidLocal();
        this.createForm();

        this.navigationSubscription = this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                const fullUrl = event.url.split(';');
                if (fullUrl[0] === '/chat/tagGroup') {
                    if (fullUrl[1]) {
                        const paramsOne = fullUrl[1].split('=');
                        this.groupId = decodeURIComponent(paramsOne[1]);
                        this.updateForm();
                    } else {
                        this.isGroupCreator = true;
                        this.newForm();
                    }
                    console.log('groupId是：', this.groupId);
                }
            }
        });
    }

    ngOnDestroy() {
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }

    createForm() {
        this.groupForm = this.formBuilder.group({
            nickname: ['', [Validators.required, Validators.pattern(APIService.nicknamePattern)]],
            phoneContacts: this.formBuilder.array([]),
            memberName: ['', [Validators.required, Validators.pattern(APIService.nicknamePattern)]],
            showMemberNickname: false
        });
    }

    get nickname() {
        return this.groupForm.get('nickname');
    }

    get phoneContacts(): FormArray {
        return this.groupForm.get('phoneContacts') as FormArray;
    }

    get memberName() {
        return this.groupForm.get('memberName');
    }

    get showMemberNickname() {
        return this.groupForm.get('showMemberNickname');
    }

    setPhoneContacts(phoneContacts: FriendInterface[]) {
        const phoneContactFGs = phoneContacts.map(phoneContact => this.formBuilder.group(phoneContact));
        const phoneContactFormArray = this.formBuilder.array(phoneContactFGs);
        this.groupForm.setControl('phoneContacts', phoneContactFormArray);
    }

    addPhoneContact(phoneContact) {
        this.phoneContacts.push(this.formBuilder.group(phoneContact));
    }

    delPhoneContact(index, item) {
        console.log('准备执行delPhoneContact，删除：', index);
        this.phoneContacts.removeAt(index);
        this.allSearchContacts.add(item);
    }

    detailPhoneContact(item) {
        localStorage.setItem(APIService.SAVE_LOCAL.currentFriendTemp, JSON.stringify(item));
        this.currentFriend = item;
        this.showContactDetail = true;
    }

    goBack() {
        if (this.showUnGrouped === true) {
            if (this.selectedItems.size > 0) {
                this.selectedItems.forEach(item => {
                    this.addPhoneContact(item);
                    while (this.allSearchContacts.has(item)) {
                        this.allSearchContacts.delete(item);
                    }
                });
            }
            this.showUnGrouped = false;
        } else {
            return this.router.navigate(['/chat/home']);
        }
    }

    showUnGroupedFriends() {
        if (this.allSearchContacts.size > 0) {
            this.selectedItems = new Set<any>();
            this.makeFormatUnGroupedFriendsWithLetters(Array.from(this.allSearchContacts));
            this.showUnGrouped = true;
            this.hideBadge = true;
        } else {
            return this.baseService.presentToast('没有未分配标签的伙伴了');
        }
    }

    /**
     * 如果没有groupId, 则准备必要的数据，新建一个群创建的模板
     */
    newForm() {
        const nickname = localStorage.getItem(APIService.SAVE_LOCAL.nickname);
        this.memberName.patchValue(nickname);
        this.storage.get(APIService.SAVE_STORAGE.allContacts).then(data => {
            if (data) {
                this.letters = data.allLetters;
                this.formatContacts = data.allContacts;

                this.allSearchContacts = new Set<any>();
                for (const one of data.allContacts) {
                    const values = one.value;
                    for (const two of values) {
                        this.allSearchContacts.add(two);
                    }
                }
            }
        });
    }

    /**
     * 如果有groupId传入进来，即代表用户是修改group而非新建group，所以需要更新groupForm的内容
     * 如果没有groupId, 或者groupId中含有当前用户的userWid，则该用户是该群的群管理员
     */
    updateForm() {
        this.groupAvatar = APIService.avatarPrefixGroup + this.groupId;
        const theWid = this.groupId.split('GROUP')[0];
        if (theWid === this.userWid) {
            this.isGroupCreator = true;
        }
        this.groupData = JSON.parse(localStorage.getItem(APIService.SAVE_LOCAL.currentFriendsInGroup));
        console.log('读取的当前group信息是：', this.groupData);

        this.nickname.patchValue(this.groupData.displayName);
        this.showMemberNickname.patchValue(this.groupData.showMemberNickname !== false);

        const memberNames = this.groupData.memberNames;
        const phoneContactsList = [];
        this.storage.get(APIService.SAVE_STORAGE.allContacts).then(data => {
            for (const one of memberNames) {
                const words = one.split('=');
                const wid = words[0];
                const nickname = words[1];
                if (this.userWid === wid) {
                    this.memberName.patchValue(nickname);
                } else {
                    const friend = new Friend(wid, this.avatarPrefix + wid, nickname);
                    friend.displayName = nickname;
                    friend.pinyinName = pinyin.getFullChars(nickname);
                    phoneContactsList.push(friend);
                }
            }

            this.initUnGroupedFriends(data.allContacts, phoneContactsList);
        });
    }


    initUnGroupedFriends(allContacts, phoneContactsList) {
        this.allSearchContacts = new Set<any>();
        for (const one of allContacts) {
            const values = one.value;
            for (const two of values) {
                this.allSearchContacts.add(two);
            }
        }
        if (this.groupId) {
            const phoneContactsListNew = [];
            for (const friend of phoneContactsList) {
                const wid = friend.wid;
                for (const one of this.allSearchContacts) {
                    const theWid = one['wid'];
                    const theDisplayName = one['displayName'];
                    if (wid === theWid) {
                        this.allSearchContacts.delete(one);         // 如果wid相同，则从allSearchContacts中删除该friend
                        friend.displayName = theDisplayName;        // 并且更新该friend的displayName为用户后来备注的名称
                        friend.pinyinName = pinyin.getFullChars(theDisplayName);
                    }
                }
                phoneContactsListNew.push(friend);
            }
            this.setPhoneContacts(phoneContactsListNew);
            console.log('群成员加工后的信息是：', phoneContactsListNew);
        }
        this.makeFormatUnGroupedFriendsWithLetters(Array.from(this.allSearchContacts));
    }

    makeFormatUnGroupedFriendsWithLetters(data) {
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


    saveGroup() {
        if (this.phoneContacts.controls.length < 2) {
            return this.baseService.presentToast('群聊成员不得低于2人');
        }
        const userNickname = localStorage.getItem(APIService.SAVE_LOCAL.nickname);
        const phoneContactsWids = [this.userWid + '=' + userNickname];
        this.phoneContacts.controls.forEach(item => {
            const word = item.value.wid + '=' + item.value.displayName;
            phoneContactsWids.push(word);
        });
        const params = {
            nickname: this.nickname.value.trim(),
            memberName: this.memberName.value.trim(),
            showMemberNickname: this.showMemberNickname.value
        };
        if (this.groupId) {
            params['groupId'] = this.groupId;
        } else {
            if (this.groupAvatar === 'assets/images/ionic-people.svg') {
                return this.baseService.presentToast('请添加群头像');
            }
        }
        this.baseService.httpPost(APIService.CHAT.editChatGroup, params, phoneContactsWids, data => {
            if (data.code === 0) {
                this.groupId = data.data;
                this.uploadPhotoBase64(this.groupAvatar);
                return this.router.navigate(['/chat/home']);
            } else {
                return this.baseService.presentToast(data.msg);
            }
        }, true);
    }

    delGroup() {
        this.baseService.httpDelete(APIService.CHAT.delChatGroup, {id: this.groupId}, data => {
            if (data['code'] === 0) {
                return this.router.navigate(['/chat']).then(() => {
                    this.storage.get(APIService.SAVE_STORAGE.currentGroupLists).then(theData => {
                        if (theData) {
                            for (let i = 0; i < theData.length; i++) {
                                if (this.groupId === theData[i].id) {
                                    theData.splice(i, 1);
                                }
                            }
                            this.storage.set(APIService.SAVE_STORAGE.currentGroupLists, theData);
                        }
                    });
                });
            } else {
                return this.baseService.presentToast(data['msg']);
            }
        }, true);
    }




    goToMessageDetail() {
        return this.router.navigate(['/chat/messagePair']).then(() => {
            this.showUnGrouped = false;
            this.showContactDetail = false;
        });
    }

    updateGroupAvatar() {
        if (this.isMobile) {
            this.openFileMobile();
        } else {
            this.openFileBrowse();
        }
    }

    openFileBrowse() {
        const inputObj = document.createElement('input');
        inputObj.setAttribute('id', '_ef');
        inputObj.setAttribute('type', 'file');
        inputObj.setAttribute('style', 'visibility:hidden');
        // inputObj.setAttribute('accept', 'image/jpeg,image/png,application/pdf,text/plain');
        // inputObj.setAttribute('directory', '');
        document.body.appendChild(inputObj);
        inputObj.addEventListener('change', event => {
            const files = event.target['files'];
            if (files.length === 1) {
                // const path = event['path'][0];
                // const filePath = path['value'];
                const file = files[0];
                const fileType = file.type;
                if (fileType === 'image/jpeg' || fileType === 'image/png') {
                    this.previewimgService.readAsDataUrlWithCompress(file, 200).then(data => {
                        console.log('转换成base64的数据为：', data);
                        this.groupAvatar = data.toString();
                    });

                } else {
                    this.baseService.presentToast('只能上传jpeg, jpg, png类型的图片');
                }
            }
        });
        inputObj.click();                           // 模拟点击
        document.body.removeChild(inputObj);        // 从DOM中移除input
    }

    async openFileMobile() {
        const options: CameraOptions = {
            destinationType: this.camera.DestinationType.DATA_URL,
            quality: 100,
            targetWidth: 150,
            targetHeight: 150,
        };
        const actionSheet = await this.actionSheetCtrl.create({
            buttons: [
                {
                    text: '拍照',
                    handler: () => {
                        options.sourceType = this.camera.PictureSourceType.CAMERA;
                        this.nativeService.getPicture(options).subscribe(data => {
                            this.groupAvatar = data;
                        });
                    }
                },
                {
                    text: '相册',
                    handler: () => {
                        options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
                        this.nativeService.getPicture(options).subscribe(data => {
                            this.groupAvatar = data;
                        });
                    }
                },
                {
                    text: '取消',
                    role: 'cancel'
                }
            ]
        });
        await actionSheet.present();
    }

    // 如果修改了groupAvatar, 则groupAvatar的值为base64的格式，而不是/getGroupPhotoLocation/id的格式了
    uploadPhotoBase64(base64Str: string) {
        if (base64Str.indexOf('data:image') !== -1) {
            if (this.groupId) {
                const params = {groupId: this.groupId};
                this.baseService.httpPost(APIService.FILEAPI.uploadGroupAvatarBase64, params, base64Str, data => {
                    if (data.code !== 0) {
                        this.baseService.presentConfirmToast('失败，请重新上传群头像');
                    }
                }, true);
            }
        }
    }
}
