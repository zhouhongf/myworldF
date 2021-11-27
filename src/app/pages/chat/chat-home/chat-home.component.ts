import {Component, OnDestroy, OnInit} from '@angular/core';
import {ContactTag} from '../../../models/system-data';
import {BaseService} from '../../../providers/base.service';
import {NavigationEnd, Router} from '@angular/router';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {APIService} from '../../../providers/api.service';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'app-chat-home',
    templateUrl: './chat-home.component.html',
    styleUrls: ['./chat-home.component.scss'],
})
export class ChatHomeComponent implements OnInit, OnDestroy {

    editTags = false;
    tags: Array<ContactTag>;
    chatGroupNumber = 0;
    navigationSubscription;

    constructor(private baseService: BaseService, private storage: Storage, private router: Router) {
    }

    ngOnInit() {
        this.navigationSubscription = this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                if (event.url === '/chat/home' || event.url === '/chat') {
                    const widNicknameAvatar = this.baseService.checkWidNicknameAvatar();
                    if (widNicknameAvatar === false) {
                        return this.router.navigate(['/sysuser/home']).then(() => {
                            this.baseService.presentToast('请先设置竞融账号、昵称和头像');
                        });
                    } else {
                        this.initContactTags();
                    }
                }
            }
        });
    }

    ngOnDestroy() {
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.tags, event.previousIndex, event.currentIndex);
    }

    // 主要是为了查看是否有离线消息，所以通过服务器获取contactTag和 群聊的群组数量和未读消息数量
    initContactTags() {
        this.editTags = false;
        this.baseService.httpGet(APIService.CHAT.getContactTagsRemote, null, data => {
            if (data['code'] === 0) {
                this.tags = data['data'];
                this.chatGroupNumber = data['num'];  // 一起返回了群聊的个数
                localStorage.setItem(APIService.SAVE_LOCAL.contactTags, JSON.stringify(this.tags));
            } else {
                this.baseService.presentToast(data['msg']);
            }
        }, true);
    }

    saveTagsOrder() {
        if (this.tags.length > 1) {
            for (let i = 0; i < this.tags.length; i++) {
                this.tags[i].order = i;
            }
            this.baseService.httpPost(APIService.CHAT.updateContactTagsOrder, null, this.tags, data => {
                if (data['code'] === 0) {
                    localStorage.setItem(APIService.SAVE_LOCAL.contactTags, JSON.stringify(this.tags));
                    this.editTags = false;
                } else {
                    this.baseService.presentToast('请重新返回一次');
                }
            });
        } else {
            this.editTags = false;
        }
    }

    goToTag(tag?) {
        if (tag) {
            this.storage.get(APIService.SAVE_STORAGE.allContacts).then(data => {
                if (data) {
                    const tagFriendList = [];
                    const allContacts = data.allContacts;
                    for (const one of allContacts) {
                        for (const two of one.value) {
                            if (tag.name === two.tag) {
                                tagFriendList.push(two);
                            }
                        }
                    }
                    const currentFriendsTag = {name: tag.name, data: tagFriendList};
                    localStorage.setItem(APIService.SAVE_LOCAL.currentFriendsInTag, JSON.stringify(currentFriendsTag));
                    return this.router.navigate(['/chat/tagPair', {tagIdDetail: tag.idDetail}]);
                } else {
                    this.baseService.presentToast('没有通讯录数据，请关闭APP然后重新打开');
                }
            });
        } else {
            return this.router.navigate(['/chat/tagPair', {tagIdDetail: 'NEW'}]);
        }
    }

    goToListPair(tag) {
        console.log('选择的标签是：', tag);
        if (tag.nums > 0) {
            this.baseService.httpGet(APIService.CHAT.getListPair, {tagName: tag.name}, data => {
                if (data['code'] === 0) {
                    const theData = data['data'];
                    if (theData) {
                        // 返回的是一个friendWid为key，offlineMessage数量为value的map
                        this.sortAndSaveLocalOfflineMessageNums(tag.name, theData);
                    } else {
                        this.sortAndSaveLocalOfflineMessageNums(tag.name);
                    }
                } else {
                    this.baseService.presentToast(data['msg']);
                }
            });
        }
    }

    sortAndSaveLocalOfflineMessageNums(tagName, theData?) {
        // 根据tagName和服务器返回的map，保存该tag下面的friend到一个集合中
        this.storage.get(APIService.SAVE_STORAGE.allContacts).then(data => {
            if (data) {
                const tagFriendList = [];
                if (theData) {
                    const allContacts = data.allContacts;
                    for (const one of allContacts) {
                        for (const two of one.value) {
                            if (tagName === two.tag) {
                                if (theData[two.wid]) {
                                    two.messageNum = theData[two.wid];
                                } else {
                                    two.messageNum = 0;
                                }
                                tagFriendList.push(two);
                            }
                        }
                    }
                } else {
                    const allContacts = data.allContacts;
                    for (const one of allContacts) {
                        for (const two of one.value) {
                            if (tagName === two.tag) {
                                two.messageNum = 0;
                                tagFriendList.push(two);
                            }
                        }
                    }
                }
                tagFriendList.sort((a, b) => {
                    return a.messageNum - b.messageNum;
                });
                const currentFriendsTag = {name: tagName, data: tagFriendList};
                localStorage.setItem(APIService.SAVE_LOCAL.currentFriendsInTag, JSON.stringify(currentFriendsTag));
                this.router.navigate(['/chat/listPair']);
            } else {
                this.baseService.presentToast('请关闭APP然后重新运行');
            }
        });
    }


    delContactTag(tag) {
        this.baseService.httpDelete(APIService.CHAT.delContactTag, {idDetail: tag.idDetail}, data => {
            if (data['code'] === 0) {
                return this.router.navigate(['/chat']);
            } else {
                this.baseService.presentToast(data['msg']);
            }
        });
    }


    goToListGroup() {
        this.baseService.httpGet(APIService.CHAT.getListGroup, null, data => {
            if (data['code'] === 0) {
                const theData = data['data'];
                if (theData) {
                    this.storage.set(APIService.SAVE_STORAGE.currentGroupLists, theData).then(res => {
                        return this.router.navigate(['/chat/listGroup']);
                    });
                } else {
                    return this.router.navigate(['/chat/tagGroup']);
                }
            } else {
                this.baseService.presentToast(data['msg']);
            }
        });
    }
}
