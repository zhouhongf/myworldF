import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {APIService} from '../../../providers/api.service';
import {BaseService} from '../../../providers/base.service';
import {Friend} from '../../../models/system-data';
import {ChatService} from '../../../providers/chat.service';
import {ContactFieldType, ContactFindOptions, Contacts} from '@ionic-native/contacts/ngx';
import {Device} from '@ionic-native/device';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'app-chat-contact-add',
    templateUrl: './chat-contact-add.component.html',
    styleUrls: ['./chat-contact-add.component.scss']
})
export class ChatContactAddComponent implements OnInit {
    isSearching = false;

    allContacts = [];
    formatContacts = [];        // 按首字母顺序格式化后的数组
    allSearchContacts = [];     // 未排序供搜索的数组
    rawPhoneContacts = [];      // 用户手机通讯录

    searchingItems = [];        // 搜索显示的数组
    searchValue;
    loader;

    worker;
    constructor(private baseService: BaseService, private chatService: ChatService, private contacts: Contacts, private storage: Storage, private router: Router) {
    }

    ngOnInit() {
        this.getPhoneContacts();
    }

    getPhoneContacts() {
        this.storage.get(APIService.SAVE_STORAGE.phoneContacts).then(data => {
            if (data) {
                this.formatContacts = data;
                for (const one of data) {
                    for (const two of one.value) {
                        this.allSearchContacts.push(two);
                    }
                }
            }
        });
    }

    checkPhoneContacts() {
        if (this.baseService.isMobile()) {
            this.rawPhoneContacts = [];
            const fields: ContactFieldType[] = ['displayName', 'phoneNumbers'];
            const options = new ContactFindOptions();
            options.filter = '';
            options.multiple = true;
            options.hasPhoneNumber = true;

            this.contacts.find(fields, options).then(result => {
                // result[0]的一个例子是：
                // {"_objectInstance":
                //      {
                //          "id":"2",
                //          "rawId":null,
                //          "displayName":"曹彻",
                //          "name":{"familyName":"曹", "givenName":"彻"，"formatted":"彻曹"}，
                //          "nickname":null,
                //          "phoneNumbers":[{"id":"3","pref":false,"value":"13771880835","type":"mobile"}],
                //          "emails":null,
                //          "addresses":null,
                //          "ims":null,
                //          "organizations":null,
                //          "birthday":null,
                //          "note":null,
                //          "photos":null,
                //          "categories":null,
                //          "urls":null
                //      },
                //  "rawId":"2"
                //  }
                // _objectInstance其实就是 const contact = this.contacts.create() 创造出来的一个contact实例
                this.onSuccess(result, this);
            });
        }
    }

    onSuccess(contacts, context) {
        const contactsLength = contacts.length;
        // 显示的名称，Android和ios不同的
        let isAndroid = true;
        if (Device.platform !== 'Android') {
            isAndroid = false;
        }

        for (let i = 0; i < contactsLength; i++) {
            if (contacts[i]._objectInstance.phoneNumbers == null) {
                continue;
            }
            let obj = {displayName: '', phoneNumber: ''};

            if (isAndroid) {
                if (contacts[i]._objectInstance.displayName != null) {
                    obj.displayName = contacts[i]._objectInstance.displayName;
                } else if (contacts[i]._objectInstance.name != null && contacts[i]._objectInstance.name.formatted != null) {
                    obj.displayName = contacts[i]._objectInstance.name.formatted;
                }
            } else {
                // ios 取一个不为空的name
                // if (contacts[i]._objectInstance.name.formatted != null) {
                //   obj.displayName = contacts[i]._objectInstance.name.formatted;
                // } else if (contacts[i]._objectInstance.name.familyName != null) {
                //   obj.displayName = contacts[i]._objectInstance.name.familyName;
                // } else {
                //   obj.displayName = contacts[i]._objectInstance.name.givenName;
                // }
                if (contacts[i]._objectInstance.name != null && contacts[i]._objectInstance.name.formatted != null) {
                    obj.displayName = contacts[i]._objectInstance.name.formatted;
                }
            }
            obj.phoneNumber = contacts[i]._objectInstance.phoneNumbers[0].value;

            const regNums = /^[0-9]+$/;
            if (regNums.test(obj.phoneNumber)) {
                const value = obj.displayName + '--' + obj.phoneNumber;
                this.rawPhoneContacts.push(value);
            }
            obj = null;
        }
        // 将手机通讯录中存储的电话号码上传至服务器，查询每一个电话号码，是否已注册为该APP用户，如已注册，则返回该电话号码对应的信息，表示用户可添加该号码为好友
        this.makeFormatPhoneContacts();
    }

    makeFormatPhoneContacts() {
        this.baseService.httpPost(APIService.CHAT.checkPhoneContacts, null, this.rawPhoneContacts, data => {
            if (data.code === 0) {
                if (typeof Worker !== 'undefined') {
                    this.worker = new Worker('./chat-contact-add.worker', {type: 'module'});
                    this.worker.onmessage = (dataOut) => {
                        this.formatContacts = dataOut.data.formatPhoneContacts;
                        this.allSearchContacts = dataOut.data.allSearchContacts;

                        this.storage.set(APIService.SAVE_STORAGE.phoneContacts, this.formatContacts);
                    };
                    // 服务器返回PhoneContactReply(wid, nickname, avatar, displayName, phoneNumber, tag)实例
                    const dataIn = {domain: APIService.domain, contacts: data.data};
                    this.worker.postMessage(dataIn);
                } else {
                    console.log('不支持Web Workers，请自定义需要后台运行的方法逻辑');
                }
            } else {
                console.log(data.msg);
            }
        });
    }


    goToContactDetail() {
        this.router.navigate(['/chat/contactDetail', {
            isFriend: APIService.no,
            backUrl: '/chat/contactAdd'
        }]);
    }

    searchContactLocal(item) {
        const currentFriend = new Friend(item.wid, item.avatar, item.nickname);
        localStorage.setItem(APIService.SAVE_LOCAL.currentFriendTemp, JSON.stringify(currentFriend));
        this.goToContactDetail();
    }

    searchContactRemote(data) {
        const value = data.trim();
        const regZh = /^[\u4e00-\u9fa5]+$/;
        const regPhone = /^0?[1|9][3|4|5|8|9][0-9]\d{8}$/;
        const regWid = /^[a-zA-Z][a-zA-Z0-9]{6,18}$/;
        if (regZh.test(value) || regPhone.test(value)) {
            return this.doSearchContactRemote(value);
        }

        if (regWid.test(value)) {
            const myWid = this.baseService.getWidLocal();
            if (myWid !== value) {
                return this.doSearchContactRemote(value);
            }
        }
        return this.baseService.presentToast('请输入正确格式的内容查询');
    }

    doSearchContactRemote(value) {
        this.baseService.httpGet(APIService.CHAT.searchContactRemote,  {value}, data => {
            if (data.code === 0) {
                const theData = data.data;
                const values: string[] = theData.split(',');
                const theWid = values[0];
                const theNickname = values[1];
                const theUsername = values[2];
                const currentFriend = new Friend(theWid, APIService.avatarPrefix + theWid, theNickname, theUsername);
                localStorage.setItem(APIService.SAVE_LOCAL.currentFriendTemp, JSON.stringify(currentFriend));
                this.goToContactDetail();
            } else {
                this.baseService.presentToast(data['msg']);
            }
        });
    }

    getItems(ev: any) {
        this.isSearching = true;
        const val = ev.target.value;
        this.searchValue = val;
        this.searchingItems = this.allSearchContacts;
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
}
