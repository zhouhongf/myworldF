import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActionSheetController, IonContent} from '@ionic/angular';
import {APIService} from '../../../providers/api.service';
import {KafkaService} from '../../../providers/kafka.service';
import {BaseService} from '../../../providers/base.service';
import {NativeService} from '../../../providers/native.service';
import {PreviewimgService} from '../../../providers/previewimg.service';
import {HttpClient} from '@angular/common/http';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {RxStompState} from '@stomp/rx-stomp';
import {ChatMessage, Friend} from '../../../models/system-data';
import {saveAs} from 'file-saver';
import {Storage} from '@ionic/storage';
import {TextToSpeech} from '@ionic-native/text-to-speech/ngx';
import {SpeechRecognition} from '@ionic-native/speech-recognition/ngx';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {Vibration} from '@ionic-native/vibration/ngx';
import {NativeAudio} from '@ionic-native/native-audio/ngx';

@Component({
    selector: 'app-chat-message-group',
    templateUrl: './chat-message-group.component.html',
    styleUrls: ['./chat-message-group.component.scss'],
})
export class ChatMessageGroupComponent implements OnInit, OnDestroy {
    navigationSubscription;
    isMobile;
    @ViewChild(IonContent, {static: false}) content: IonContent;
    keyboardHeight = '0px';

    textType = APIService.MESSAGE_TYPE.text;
    fileType = APIService.MESSAGE_TYPE.file;
    photoType = APIService.MESSAGE_TYPE.photo;

    userWid;
    avatarPrefix = APIService.avatarPrefix;
    groupData;
    groupId;
    friendsInGroup = new Set<any>();

    state = 'CLOSED';
    messageContent;                         // 在输入框输入的消息内容
    messageIdPrefix: string;
    storageKey: string;
    messages = new Array<ChatMessage>();    // 页面显示的所有的聊天记录
    pageSize = 10;
    pageIndex = 0;

    sideMenuOpen = false;
    showMemberNickname = false;

    // 收到消息 声音通知
    onSuccess: any;
    onError: any;
    soundIndex = 1;

    constructor(
        private kafkaService: KafkaService,
        private baseService: BaseService,
        private storage: Storage,
        private nativeService: NativeService,
        private previewimgService: PreviewimgService,
        private http: HttpClient,
        private elementRef: ElementRef,
        private camera: Camera,
        private actionSheetCtrl: ActionSheetController,
        private route: ActivatedRoute,
        private router: Router,
        private localNotifications: LocalNotifications,
        private vibration: Vibration,
        private nativeAudio: NativeAudio,
        private tts: TextToSpeech,
        private speechRecognition: SpeechRecognition
    ) {
    }

    ngOnInit() {
        this.initOnce();
        this.navigationSubscription = this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                if (event.url === '/chat/messageGroup') {
                    this.initEveryTime();
                }
            }
        });
    }

    notice(messageContent: string) {
        // this.vibration.vibrate(1000);
        this.nativeAudio.play('uniqueId1').then(this.onSuccess, this.onError);
        this.localNotifications.schedule({
            id: this.soundIndex,                                //  将来清除，取消，更新或检索本地通知所需的唯一标识符默认值：0
            title: '消息通知',
            text: messageContent,
            trigger: {at: new Date(new Date().getTime())},      // 何时触发通知
            // 声音设置了无效
            sound: null,                                        // 显示警报时包含播放声音的文件的Uri默认值：res：// platform_default
            launch: true,
            lockscreen: true                                    // 仅限ANDROID如果设置为true，则通知将在所有锁定屏幕上完整显示。如果设置为false，则不会在安全锁屏上显示。
        });
        this.soundIndex++;
    }

    initOnce() {
        // this.listenKeyboard();
        this.isMobile = this.baseService.isMobile();
        this.userWid = this.baseService.getWidLocal();
    }

    initEveryTime() {
        this.messages = new Array<ChatMessage>();

        this.groupData = JSON.parse(localStorage.getItem(APIService.SAVE_LOCAL.currentFriendsInGroup));
        this.groupId = this.groupData.id;
        this.showMemberNickname = this.groupData.showMemberNickname;
        this.storageKey = APIService.MESSAGE_TYPE.chatGroup + '-' + this.groupId;
        // messageId格式如：groupId-ABC123456789-GROUP-TEXT-1580184911951
        this.messageIdPrefix = this.groupId + '-' + this.userWid + '-' + APIService.MESSAGE_TYPE.chatGroup + '-';

        this.makeCurrentFriendsInGroup();

        // websocket链接
        if (this.state !== 'CLOSED') {
            this.kafkaService.disconnect();
        }
        this.connect();

        // 通过storageKey从本地获取最近的30条聊天记录
        this.storage.get(this.storageKey).then(theData => {
            if (theData) {
                // 从末尾开始取最后30条记录
                const lastStartNumber = 0 - this.pageSize;
                this.messages = theData.slice(lastStartNumber);
                // 下滑至页面底部，即显示最新的一条聊天记录
                this.onFocus();
            }
        });
    }

    makeCurrentFriendsInGroup() {
        this.storage.get(APIService.SAVE_STORAGE.allContacts).then(data => {
            const allSearchContacts = new Set<any>();
            for (const one of data.allContacts) {
                const values = one.value;
                for (const two of values) {
                    allSearchContacts.add(two);
                }
            }

            const memberNames = this.groupData.memberNames;
            for (const one of memberNames) {
                const words = one.split('=');
                const wid = words[0];
                const nickname = words[1];
                if (wid !== this.userWid) {
                    const friend = new Friend(wid, this.avatarPrefix + wid, nickname, '', nickname);
                    for (const two of allSearchContacts) {
                        if (wid === two.wid) {
                            friend.displayName = two.displayName;
                            friend.phoneNumber = two.phoneNumber;
                            friend.tag = two.tag;
                        }
                    }
                    this.friendsInGroup.add(friend);
                }
            }
            console.log('群内朋友有：', this.friendsInGroup);
        });
    }

    getHistoryChatMessagesRemote() {
        const params = {pageSize: this.pageSize, startNumber: this.messages.length, groupId: this.groupId};
        this.baseService.httpGet(APIService.CHAT.getChatMessagesGroup, params, data => {
            if (data.code === 0) {
                const values: Array<ChatMessage> = data.data;
                for (const one of values) {
                    this.messages.unshift(one);
                }
                console.log('从服务器获取的数据是：', this.messages);
                this.storage.get(this.storageKey).then(theData => {
                    let dataArray = [];
                    if (theData) {
                        dataArray = theData;
                    }
                    for (const one of values) {
                        dataArray.unshift(one);
                    }
                    this.storage.set(this.storageKey, dataArray);
                }, err => {
                    console.log('未能获取:', err);
                });
            } else {
                this.baseService.presentToast(data.msg);
            }
        });
    }

    // 下拉屏幕添加历史聊天记录
    doRefresh(event) {
        this.storage.get(this.storageKey).then(theData => {
            if (theData) {
                // 如果本地有聊天记录储存，并且本次会话的聊天记录条数小于本地储存的聊天记录条数，则从本地聊天记录中读取
                // 否则，从服务器上读取聊天记录
                if (this.messages.length < theData.length) {
                    const totalNumberNeed = this.messages.length + this.pageSize * (this.pageIndex + 1);
                    const lastStartNumber = 0 - totalNumberNeed;
                    this.messages = theData.slice(lastStartNumber);
                    this.pageIndex = this.pageIndex + 1;
                    // 按照时间先后排序
                    // this.messages.sort((a, b) => {
                    //     return b.sendTime - a.sendTime;
                    // });
                } else {
                    this.getHistoryChatMessagesRemote();
                }
            } else {
                this.getHistoryChatMessagesRemote();
            }
        });

        setTimeout(() => {
            event.target.complete();
        }, 400);
    }

    scrollToTop(lastLeaveTime) {
        const el = this.elementRef.nativeElement.querySelector('p#' + lastLeaveTime);
        if (el) {
            setTimeout(() => {
                el.scrollIntoView(true);
            });
        }
    }

    ngOnDestroy() {
        console.log('====================ChatMessageGroupComponent执行ngOnDestroy方法================');
        // window.removeEventListener('keyboardWillShow', evt => {});
        // window.removeEventListener('keyboardWillHide', evt => {});
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
        this.kafkaService.disconnect();
    }

    onFocus() {
        setTimeout(() => {
            this.content.scrollToBottom();
        }, 400);
    }

    listenKeyboard() {
        window.addEventListener('keyboardWillShow', event => {
            const height = event['keyboardHeight'];
            const newHeight = Number(height) + 50;
            this.keyboardHeight = newHeight + 'px';
        });
        window.addEventListener('keyboardWillHide', () => {
            this.keyboardHeight = '0px';
        });
    }

    connect() {
        this.kafkaService.connect(this.userWid);
        this.kafkaService.state().subscribe((state: RxStompState) => {
            this.state = RxStompState[state];
            console.log('连接状态：', this.state);
        });
        this.subscribeGroup();
    }

    // 将收到和发送的消息保存到本地储存，收到一条保存一条，发送一条保存一条
    updateLocalData(chatMessage: ChatMessage) {
        this.storage.get(this.storageKey).then(theData => {
            let dataArray = [];
            if (theData) {
                dataArray = theData;
            }
            dataArray.push(chatMessage);
            this.storage.set(this.storageKey, dataArray);
        });
    }

    subscribeGroup() {
        this.kafkaService.subscribeGroup(this.groupId).subscribe(data => {
            const value = JSON.parse(data.body);
            if (!value.link) {
                value.link = undefined;
            }
            const currentTime = new Date().getTime();
            const chatMessage = new ChatMessage(value.fromName, value.toName, value.content, value.type, value.sendTime, value.id, value.link, currentTime);
            this.messages.push(chatMessage);
            this.updateLocalData(chatMessage);
            this.onFocus();
            console.log('已收到消息：', chatMessage);
            if (this.isMobile) {
                this.notice(chatMessage.content);
            }

            data.ack({messageId: value.id, ackTime: currentTime.toString(), sender: value.fromName});
        });
    }

    doSendMessage(chatMessage: ChatMessage) {
        this.messages.push(chatMessage);
        this.kafkaService.sendGroup(JSON.stringify(chatMessage));
        this.updateLocalData(chatMessage);
        this.onFocus();
    }

    sendMsg() {
        const sendTime = new Date().getTime();
        const messageId = this.messageIdPrefix + this.textType + '-' + sendTime;
        const chatMessage = new ChatMessage(this.userWid, this.groupId, this.messageContent, this.textType, sendTime, messageId);
        this.doSendMessage(chatMessage);
        console.log('已发送消息：', chatMessage);
        this.messageContent = undefined;
    }


    sendFile() {
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
        document.body.appendChild(inputObj);
        inputObj.addEventListener('change', event => {
            const files = event.target['files'];
            if (files.length === 1) {
                const file = files[0];
                const fileType = file.type;
                if (fileType === 'image/jpeg' || fileType === 'image/png') {
                    this.previewimgService.readAsDataUrlWithCompress(file, 800).then(data => {
                        const base64Str = data.toString();
                        this.uploadPhotoBase64(base64Str);
                    });
                } else {
                    console.log('不是图片，不能压缩处理，作为文件上传');
                    this.uploadFile(file);
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
            targetWidth: 800,
            targetHeight: 600,
        };
        const actionSheet = await this.actionSheetCtrl.create({
            buttons: [
                {
                    text: '拍照',
                    handler: () => {
                        options.sourceType = this.camera.PictureSourceType.CAMERA;
                        this.nativeService.getPicture(options).subscribe(data => {
                            this.uploadPhotoBase64(data);
                        });
                    }
                },
                {
                    text: '相册',
                    handler: () => {
                        options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
                        this.nativeService.getPicture(options).subscribe(data => {
                            this.uploadPhotoBase64(data);
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

    uploadPhotoBase64(base64Str) {
        const sendTime = new Date().getTime();
        const params = {toNames: this.groupId, sendTime};
        this.baseService.httpPost(APIService.FILEAPI.uploadChatPhotoBase64, params, base64Str, data => {
            if (data.code === 0) {
                const base64 = data.data;
                const messageId = this.messageIdPrefix + this.photoType + '-' + sendTime;
                const link = APIService.domain + '/getChatFileLocation/' + this.photoType + '-' + this.userWid + '-' + sendTime;
                const chatMessage = new ChatMessage(this.userWid, this.groupId, base64, this.photoType, sendTime, messageId, link);
                this.doSendMessage(chatMessage);
            } else {
                this.baseService.presentConfirmToast('失败，请重新上传');
            }
        }, true);
    }

    uploadFile(file) {
        const fileName = file.name;
        const sendTime = new Date().getTime();
        const formData: FormData = new FormData();
        formData.append('file', file);
        const params = {toNames: this.groupId, sendTime};

        this.baseService.httpPost(APIService.FILEAPI.uploadChatFile, params, formData, data => {
            if (data.code === 0) {
                const messageId = this.messageIdPrefix + this.fileType + '-' + sendTime;
                const link = APIService.domain + '/getChatFileLocation/' + this.fileType + '-' + this.userWid + '-' + sendTime;
                const chatMessage = new ChatMessage(this.userWid, this.groupId, fileName, this.fileType, sendTime, messageId, link);
                this.doSendMessage(chatMessage);
            } else {
                this.baseService.presentConfirmToast('失败，请重新上传');
            }
        }, true);
    }

    downloadFile(msg) {
        if (this.isMobile) {
            const type = APIService.getFileType(msg.content);
            this.nativeService.downloadXHR(msg.link, msg.content, type);
        } else {
            this.http.get(msg.link, {responseType: 'blob'}).subscribe(
                data => {
                    const theBlob = new Blob([data], {type: 'application/octet-stream'});
                    saveAs(theBlob, msg.content);
                }, err => {
                    this.baseService.presentToast(JSON.stringify(err));
                });
        }
    }


    goToFriendDetail(friend) {
        let isFriend;
        if (friend.phoneNumber != null && friend.phoneNumber !== '') {
            isFriend = APIService.yes;
        } else {
            isFriend = APIService.no;
        }
        const backUrl = '/chat/messageGroup';
        localStorage.setItem(APIService.SAVE_LOCAL.currentFriendTemp, JSON.stringify(friend));
        return this.router.navigate(['/chat/contactDetail', {isFriend, backUrl}]).then(() => {
            this.friendsInGroup = new Set<any>();
        });
    }

    readMessage(content) {
        this.tts.speak({text: content, locale: 'zh-CN', rate: 0.75})
            .then(() => console.log('Success'))
            .catch((reason: any) => console.log(reason));
    }

    startListen() {
        const options = {
            language: 'zh-CN',
            matches: 5,
            prompt: '',
            showPopup: true,
            showPartial: false
        };
        this.speechRecognition.startListening(options).subscribe(
            (matches: string[]) => {
                this.messageContent = matches[0];
            },
            (onerror) => console.log('error:', onerror)
        );
    }
}

