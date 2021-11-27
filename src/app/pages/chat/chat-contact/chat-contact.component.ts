import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {APIService} from '../../../providers/api.service';
import {NavigationEnd, Router} from '@angular/router';
import {BaseService} from '../../../providers/base.service';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'app-chat-contact',
    templateUrl: './chat-contact.component.html',
    styleUrls: ['./chat-contact.component.scss']
})
export class ChatContactComponent implements OnInit, OnDestroy {
    isSearching = false;
    letters = new Set();
    formatContacts = [];  // 按首字母顺序格式化后的数组
    allSearchContacts = [];  // 未排序供搜索的数组
    searchingItems = []; // 搜索显示的数组
    friendApplyNum: number;

    navigationSubscription;

    constructor(private baseService: BaseService, private storage: Storage, private elementRef: ElementRef, private router: Router) {
    }

    ngOnInit() {
        this.navigationSubscription = this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                if (event.url === '/chat/contact') {
                    this.getFriendAppliesLocal();
                    this.getAllContactsLocal();
                }
            }
        });
    }

    ngOnDestroy() {
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }


    getFriendAppliesLocal() {
        this.storage.get(APIService.SAVE_STORAGE.friendApplies).then(data => {
            if (data) {
                this.friendApplyNum = data.length;
            }
        });
    }

    getAllContactsLocal() {
        this.storage.get(APIService.SAVE_STORAGE.allContacts).then(data => {
            if (data) {
                this.letters = data.allLetters;
                this.formatContacts = data.allContacts;
                if (this.formatContacts) {
                    for (const one of this.formatContacts) {
                        const values = one.value;
                        for (const two of values) {
                            this.allSearchContacts.push(two);
                        }
                    }
                }
            }
        });
    }

    scrollToTop(letter) {
        const el = this.elementRef.nativeElement.querySelector('ion-item-divider#' + letter);
        if (el) {
            setTimeout(() => {
                el.scrollIntoView(true);
            });
        }
    }

    searchContact() {
        this.isSearching = true;
        this.searchingItems = this.allSearchContacts;
    }

    getItems(ev: any) {
        this.isSearching = true;
        this.searchingItems = this.allSearchContacts;
        const val = ev.target.value;
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
                    return (item.pinyinName.toLowerCase().indexOf(val.toLowerCase()) > -1);
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

    selectThis(item) {
        localStorage.setItem(APIService.SAVE_LOCAL.currentFriendTemp, JSON.stringify(item));
        this.router.navigate(['/chat/contactDetail', {
            isFriend: APIService.yes,
            backUrl: '/chat/contact'
        }]);
    }
}
