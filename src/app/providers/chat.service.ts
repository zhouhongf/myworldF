import {Injectable} from '@angular/core';
import {APIService} from './api.service';
import {pinyin} from '../models/pingyin';
import {Friend} from '../models/system-data';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';


@Injectable({
    providedIn: 'root'
})
export class ChatService {

    constructor(private http: HttpClient, private storage: Storage) {
    }

    makeHttpSession() {
        this.http.get(APIService.chatSession).subscribe();
    }


    sortContacts(formatContacts) {
        // 首字母排序
        formatContacts.sort((a, b) => {
            return a.key - b.key;
        });

        // 每组内部排序
        for (const formatContact of formatContacts) {
            formatContact.value.sort((a, b) => {
                return a.key - b.key;
            });
        }
        return formatContacts;
    }


    checkPhoneApplies() {
        this.http.get(APIService.domain + APIService.CHAT.checkPhoneApplies).subscribe(
            data => {
                if (data['code'] === 0) {
                    const friendApplies = data['data'];
                    this.storage.set(APIService.SAVE_STORAGE.friendApplies, friendApplies);
                } else {
                    this.storage.remove(APIService.SAVE_STORAGE.friendApplies);
                }
            }, err => {
                console.log(JSON.stringify(err));
            });
    }

    addToAllContacts(obj: Friend) {
        let formatLetters = new Set<any>();
        let formatContacts = [];
        this.storage.get(APIService.SAVE_STORAGE.allContacts).then(data => {
            if (data) {
                formatLetters = new Set<any>(data.allLetters);
                formatContacts = data.allContacts;
            }

            const reg = /^[A-Za-z]+$/;
            const len = formatContacts.length;
            if (!reg.test(obj.pinyinName) || obj.displayName === '') {
                // 非正常名字，联系人中文名字转为拼音，不符合英文正则，或者中文名字为空的，放入Z栏下
                for (let j = 0; j < len; j++) {
                    if ((formatContacts[j] as any).key === '#') {
                        (formatContacts[j] as any).value.push(obj);
                        formatLetters.add('#');
                        break;
                    }
                }
            } else {
                const camelChar = pinyin.getCamelChars(obj.displayName).substring(0, 1);
                if (reg.test(camelChar)) {
                    // 首字母符合英文正则
                    let j = 0;
                    for (j; j < len; j++) {
                        if ((formatContacts[j] as any).key === camelChar) {
                            (formatContacts[j] as any).value.push(obj);  // 将对象obj放入对应的首字母栏下
                            break;
                        }
                    }
                    if (j === len) { // 处理最后一个obj
                        const arr = [];
                        arr.push(obj);
                        formatContacts[len] = {key: camelChar, value: arr};
                    }
                    formatLetters.add(camelChar);
                }
            }
            const formatContactsSort = this.sortContacts(formatContacts);
            const formatLettersSort = Array.from(formatLetters).sort();
            const theFullContactsData = {allLetters: formatLettersSort, allContacts: formatContactsSort};
            console.log('准备要保存进storage中：', theFullContactsData);
            this.storage.set(APIService.SAVE_STORAGE.allContacts, theFullContactsData);
        });
    }


    getTagNameList() {
        const dataList = localStorage.getItem(APIService.SAVE_LOCAL.contactTags);
        if (dataList) {
            const tagList = [];
            const theList = JSON.parse(dataList);
            for (const value of theList) {
                tagList.push(value.name);
            }
            return tagList;
        } else {
            return null;
        }
    }

    prepareShowBlogsForLive(showBlogs, userWid, nickname, userAvatar): Observable<any> {
        return new Observable(observer => {
            const newShowBlogs = [];
            this.storage.get(APIService.SAVE_STORAGE.allContacts).then(data => {
                const searchContacts = [];
                for (const one of data.allContacts) {
                    for (const two of one.value) {
                        searchContacts.push(two);
                    }
                }

                for (const showBlog of showBlogs) {
                    const theWid = showBlog.userWid;
                    const showPhotosFull = [];
                    if (showBlog.showPhotos.length > 0) {
                        for (const photo of showBlog.showPhotos) {
                            showPhotosFull.push(APIService.domain + '/getPhotoShowLocation/' + photo);
                        }
                    }

                    const showBlogCommentsFull = [];
                    const showBlogCommentsSet = showBlog.showBlogComments;
                    if (showBlogCommentsSet.length > 0) {
                        for (const blogComment of showBlogCommentsSet) {
                            const commenterWid = blogComment.commenterWid;
                            const commentToWid = blogComment.commentToWid;

                            let commenterDisplayName;
                            let commentToDisplayName;
                            if (commenterWid === userWid) {
                                commenterDisplayName = nickname;
                            } else {
                                for (const searchContact of searchContacts) {
                                    if (commenterWid === searchContact.wid) {
                                        commenterDisplayName = searchContact.displayName;
                                        break;
                                    }
                                }
                            }
                            if (commentToWid) {
                                if (commentToWid === userWid) {
                                    commentToDisplayName = nickname;
                                } else {
                                    for (const searchContact of searchContacts) {
                                        if (commentToWid === searchContact.wid) {
                                            commentToDisplayName = searchContact.displayName;
                                            break;
                                        }
                                    }
                                }
                            }

                            const obj = {
                                blogIdDetail: blogComment.blogIdDetail,
                                comment: blogComment.comment,
                                createTime: blogComment.createTime,
                                commenterWid,
                                commenterDisplayName,
                                commentToWid,
                                commentToDisplayName
                            };
                            showBlogCommentsFull.push(obj);
                        }
                    }
                    showBlogCommentsFull.sort((a, b) => {
                        return a.createTime - b.createTime;
                    });
                    if (theWid === userWid) {
                        const obj = {
                            idDetail: showBlog.idDetail,
                            userWid: showBlog.userWid,
                            displayName: nickname,
                            avatar: userAvatar,
                            content: showBlog.content,
                            showPhotos: showPhotosFull,
                            showBlogComments: showBlogCommentsFull
                        };
                        newShowBlogs.push(obj);
                    } else {
                        for (const searchContact of searchContacts) {
                            const wid = searchContact.wid;
                            const avatar = searchContact.avatar;
                            const displayName = searchContact.displayName;
                            if (theWid === wid) {
                                const obj = {
                                    idDetail: showBlog.idDetail,
                                    userWid: showBlog.userWid,
                                    displayName,
                                    avatar,
                                    content: showBlog.content,
                                    showPhotos: showPhotosFull,
                                    showBlogComments: showBlogCommentsFull
                                };
                                newShowBlogs.push(obj);
                                break;
                            }
                        }
                    }
                }
                observer.next(newShowBlogs);
            });
        });
    }
}
